import React, { Component } from "react";
import getCookie from "../tools/getCookie";
import dayjs from 'dayjs';
class SelfHealingWebSocket {
    constructor( downCallback, upCallback, allMessagesHandler, ...initializationArgs ) {
        this.initializationArgs = initializationArgs;
        this.connection = null;
        this.downCallback = downCallback;
        this.upCallback = upCallback;
        this.allMessagesHandler = function ( event ) {
            const data = JSON.parse( event.data );
            allMessagesHandler( data );
        };
        this.respawnWebSocket();
    }
    closeEL = event => {
        console.log( "[close] Соединение закрыто. Отчёт: ", event );
        this.downCallback();
        setTimeout( this.respawnWebSocket, 3000 );
        // TODO: Добавить нарастающую задержку перед следующим переподключением
    };
    errorEL = function ( error ) {
        console.error( "[error] Ошибка! Отчёт: " );
        console.log( error );
    };
    messageEL = event => {
        console.log( "[message] Сервер отправил сообщение. Отчёт: ", event );
        try {
            const data = JSON.parse( event.data );
            console.log( "[message] Данные: ", data );
        } catch ( error ) {
            this.errorEL( error );
        }
    };
    openEL = event => {
        console.log( "[open] Соединение установлено" );
        this.upCallback();
    };
    respawnWebSocket = () => {
        this.connection = null;
        // @ts-ignore
        this.connection = new WebSocket( ...this.initializationArgs );
        this.connection.addEventListener( "error", this.errorEL );
        this.connection.addEventListener( "open", this.openEL );
        this.connection.addEventListener( "message", this.messageEL );
        this.connection.addEventListener( "message", this.allMessagesHandler );
        this.connection.addEventListener( "close", this.closeEL );
    };
    isAvailable = () => this.connection?.readyState === 1;
    sendRaw = data => {
        console.log( "[sendRaw] Данные: ", data );
        if( this.isAvailable() ) {
            this.connection.send( data );
        } else {
            alert( "Соединение с сервером не установлено." );
        }
    };
    send = data => this.sendRaw( JSON.stringify( data ) );
}

export const GlobalContext = React.createContext( {
    isAuthorized: false,
    fullName: "",
    authorizationActions: {
        logout: () => {},
        register: () => {},
        login: () => {}
    },
    timingsActions: {
        syncProcessTimingsWithServer: () => {},
        addEmptyTiming: () => {},
        removeTiming: () => {},
        increasePrecision: () => {},
        decreasePrecision: () => {},
        setExactTimingValue: () => {},
        makeProcessesBackup: () => {},
    },
    isAuthInProcess: false,
    isRegistrationAllowed: false,
    processes: [],
    sensors: [],
    processesStates: {},
    records: [],
    sendRawQuery: () => {},
    isFarmConnected: null,
});

class GlobalContextBasedOnDataFromWS extends Component {
    state = {
        isAuthInProcess: false,
        isLogoutInProcess: false,
        isRegistrationAllowed: JSON.parse( getCookie( "isRegistrationAllowed" ) ),
        isAuthorized: false,
        fullName: "",
        processes: [],
        sensors: [],
        processesStates: {},
        records: [],
        isFarmConnected: null,
    }
    constructor( props ) {
        super( props );
        if ( sessionStorage.getItem( "isAuthorized") !== "true" ) {
            sessionStorage.setItem( "isAuthorized", "false" );
            sessionStorage.setItem( "fullName", "" );
            sessionStorage.setItem( "lastEmail", "" );
            sessionStorage.setItem( "lastPassword", "" );
        } else {
            this.state.isAuthorized = true;
            this.state.fullName = sessionStorage.getItem( "fullName" );
        }
        this.ws = null;
        this.processesBackup = null;
    }
    makeProcessesBackup = procIndex => {

    };
    upWatcher = () => {
        if( sessionStorage.getItem( "isAuthorized") !== "true" ) return;
        this.login(
            sessionStorage.getItem( "lastEmail" ),
            sessionStorage.getItem( "lastPassword" )
        );
    };
    downWatcher = () => {
        this.setState( ps => ( {
            ...ps,
            isAuthorized: false,
            fullName: "",
            isFarmConnected: null
        } ) );
    };
    messageParser = data => {
        switch ( data.class ) {
            case "configPackage":
                this.setState( ps => ( {
                    ...ps,
                    ...data.package
                } ) );
                break;
            case "activitySyncPackage":
                this.setState( ps => ( {
                    ...ps,
                    processesStates: data.package
                } ) );
                break;
            case "recordsPackage":
                this.setState( ps => {
                    const records = {};
                    Object.keys( data.package ).forEach( (key) => {
                        const values = data.package[ key ].map((item) => {
                            return {
                                x: new Date(item.x),
                                y: item.y,
                            };
                        });
                        const reducedValues = values.reduce((acc, item) => {
                            const lastItem = acc[acc.length - 1];
                            if (lastItem && dayjs(item.x).diff(dayjs(lastItem.x), 'minutes') > 20) {
                                acc.push({y: NaN, x: lastItem.x});
                            }
                            acc.push(item);
                            return acc;
                        }, []);
                        records[ key ] = reducedValues;
                    })
                    return {
                        ...ps,
                        records
                    }
                } );
                // добавляем в state.records
                // а чтобы понять какие последние, просто ждём newestRecordsPackage
                break;
            case "newestRecordsPackage":
                // закидываем глубоко в структуру сенсоров
                this.setState( ps => {
                    const sensors = [ ...ps.sensors ];
                    for( const record of data.package ) {
                        ps.sensors.find( ( sensor, index ) => {
                            if ( sensor.long === record.sensor ) {
                                const newLastRecord = { ...ps.sensors[ index ].lastRecord };
                                const newSensor = { ...ps.sensors[ index ] };
                                newLastRecord.value = record.value;
                                newLastRecord.date = record.date;
                                newSensor.lastRecord = newLastRecord;
                                sensors[ index ] = newSensor;
                                return true;
                            }
                            return false;
                        } );
                    }
                    return {
                        ...ps,
                        sensors
                    }
                } );
                break;
            case "warning":
            case "records":
                // добавляем в state.records и закидываем глубоко в структуру сенсоров
                this.setState( ps => {
                    const sensors = [ ...ps.sensors ];
                    const records = { ...ps.records };
                    ps.sensors.find( ( sensor, index ) => {
                        if ( sensor.long === data.sensor ) {
                            const newLastRecord = { ...ps.sensors[ index ].lastRecord };
                            const newSensor = { ...ps.sensors[ index ] };
                            newLastRecord.value = data.value;
                            newLastRecord.date = data.date;
                            newSensor.lastRecord = newLastRecord;
                            sensors[ index ] = newSensor;
                            const newRecord = {
                                x: new Date(data.date),
                                y: data.value,
                            }
                            const lastItem = records[sensor.long][records[sensor.long].length - 1];
                            if (lastItem && dayjs(newRecord.x).diff(dayjs(lastItem.x), 'minutes') > 20) {
                                records[sensor.long].push({y: NaN, x: lastItem.x});
                            }
                            records[ sensor.long ].push( newRecord );
                            return true;
                        }
                        return false;
                    } );
                    return {
                        ...ps,
                        sensors,
                        records
                    }
                } );
                break;
            case "event":
                this.setState( ps => ( {
                    ...ps,
                    processesStates: {
                        ...ps.processesStates,
                        [ data.process ]: data.isActive
                    }
                } ) );
                break;
            case "loginAsUser":
            case "registerAsUser":
                this.setState( ps => ( {
                    ...ps,
                    isAuthInProcess: false
                } ) );
                if ( data.report.isError ) {
                    alert( data.report.errorField + "   " + data.report.info );
                    return;
                }
                sessionStorage.setItem( "isAuthorized", "true" );
                sessionStorage.setItem( "fullName", data.reply.fullName );
                sessionStorage.setItem( "lastEmail", data.reply.email );
                sessionStorage.setItem( "lastPassword", data.reply.password );
                this.setState( ps => ( {
                    ...ps,
                    isAuthorized: true,
                    fullName: data.reply.fullName,
                    isRegistrationAllowed: false
                } ) );
                break;
            case "logout":
                sessionStorage.setItem( "isAuthorized", "" + false );
                sessionStorage.setItem( "fullName", "" );
                sessionStorage.setItem( "lastEmail", "" );
                sessionStorage.setItem( "lastPassword", "" );
                this.setState( ps => ( {
                    ...ps,
                    isAuthorized: false,
                    fullName: "",
                    isLogoutInProcess: false
                } ) );
                break;
            case "error":
                alert( "Ошибка, сообщите программисту этот текст: " + data.message );
                break;
            case "farmState":
                this.setState( ps => ( {
                    ...ps,
                    isFarmConnected: data.isFarmConnected
                } ) );
                break;
            case "timings":
                this.setState( ps => {
                    const ns = { ...ps };
                    for ( const proc of ns.processes ) {
                        if ( proc.long === data.process ) {
                            proc.timings = data.timings;
                            break;
                        }
                    }
                    ns.processes = [ ...ns.processes ];
                    return ns;
                } );
                break;
            case "criticalBorders":
                this.setState( ps => {
                    const ns = { ...ps };
                    for ( const sensor of ns.sensors ) {
                        if ( sensor.long === data.sensor ) {
                            sensor.criticalBorders = data.criticalBorders;
                            break;
                        }
                    }
                    ns.sensors = [ ...ns.sensors ];
                    return ns;
                } );
                break;
            default:
                alert( "Пришло нечто неожиданное, сообщите программисту этот текст: " + JSON.stringify( data ) );
        }
    };
    syncProcessTimingsWithServer = ( { location } ) => {
        const [ processIndex ] = location.split("_").map( e => parseInt( e ) );
        this.ws && this.ws.send( {
            class: "set",
            what: "timings",
            process: this.state.processes[ processIndex ].long,
            timings: this.state.processes[ processIndex ].timings
        } );
    };
    addEmptyTiming = ( { location } ) => {
        this.setState( ps => {
            const [ processIndex ] = location.split("_").map( e => parseInt( e ) );
            const processes = [ ...ps.processes ];
            processes[ processIndex ] = {
                ...processes[ processIndex ],
                timings: [
                    ...processes[ processIndex ].timings,
                    [ [ 0 ], [ 0 ] ]
                ]
            };
            return { ...ps, processes };
        } );
    };
    newTimeSetterer = timeChanger => ( { location, value } ) => {
        const [ processIndex, timingIndex, changerIndex, index ] = location.split("_").map( e => parseInt( e ) );
        this.setState( ps => {
            const newTime = timeChanger( [ ...ps.processes[ processIndex ].timings[ timingIndex ][ changerIndex ] ], index, value );
            const newTiming = [ ...ps.processes[ processIndex ].timings[ timingIndex ] ];
            const newTimings = [ ...ps.processes[ processIndex ].timings ];
            const newProcess = { ...ps.processes[ processIndex ] };
            const processes = [ ...ps.processes ];

            newTiming[ changerIndex ] = newTime;
            newTimings[ timingIndex ] = newTiming;
            newProcess.timings = newTimings;
            processes[ processIndex ] = newProcess;
            return {
                ...ps,
                processes
            }
        } );
    };
    removeTiming = ( { location } ) => {
        this.setState( ps => {
            const [ processIndex, timingIndexForDeletion ] = location.split("_").map( e => parseInt( e ) );
            const timings = [];
            ps.processes[ processIndex ].timings.forEach( ( timing, timingIndex ) => {
                if ( timingIndex === timingIndexForDeletion ) return;
                timings.push( timing );
            });
            const processes = [ ...ps.processes ];
            processes[ processIndex ] = {
                ...processes[ processIndex ],
                timings
            };
            return { ...ps, processes };
        } );
    };
    newTimeSetter = timeChanger => ( { location, value } ) => {
        const [ processIndex, timingIndex, changerIndex, index ] = location.split("_").map( e => parseInt( e ) );
        this.setState( ps => {
            const newTime = timeChanger( [ ...ps.processes[ processIndex ].timings[ timingIndex ][ changerIndex ] ], index, value );
            const newTiming = [ ...ps.processes[ processIndex ].timings[ timingIndex ] ];
            const newTimings = [ ...ps.processes[ processIndex ].timings ];
            const newProcess = { ...ps.processes[ processIndex ] };
            const processes = [ ...ps.processes ];

            newTiming[ changerIndex ] = newTime;
            newTimings[ timingIndex ] = newTiming;
            newProcess.timings = newTimings;
            processes[ processIndex ] = newProcess;
            return {
                ...ps,
                processes
            }
        } );
    };
    increasePrecision = this.newTimeSetter( time => {
        time.push( 0 );
        return time;
    });
    decreasePrecision = this.newTimeSetter( time => {
        time.pop();
        return time;
    });
    setExactTimingValue = this.newTimeSetter( ( time, index, value ) => {
        const maxs = [ 24, 60, 60 ];
        let intValue = parseInt( value );
        time[ index ] = isNaN( intValue ) || intValue < 0 ? 0 : intValue > maxs[ index ] ? maxs[ index ] : intValue;
        return time;
    });
    isAuthSessionChanged = () => false && ( sessionStorage.getItem( "connect.sid" ) !== getCookie( "connect.sid" ) );
    logout = () => {
        // запрос на выход чтобы сервер стёр сессию
        if ( this.state.isLogoutInProcess || this.state.isAuthInProcess ) return;
        this.ws && this.ws.send( { class : "logout" } );
        this.setState( ps => ( {
            ...ps,
            isLogoutInProcess: true
        } ) );
    };
    authorize = query => {
        if ( this.state.isLogoutInProcess || this.state.isAuthInProcess ) return;
        this.ws && this.ws.send( query );
        this.setState( ps => ( {
            ...ps,
            isAuthInProcess: true
        } ) );
    };
    login = ( email, password ) => this.authorize(
        {
            class: "loginAsUser",
            email,
            password,
        }
    );
    register = ( email, password, confirmPassword, fullName ) => this.authorize(
        {
            class: "registerAsUser",
            email,
            password,
            confirmPassword,
            fullName
        }
    );
    authorizationActions = {
        logout: this.logout,
        register: this.register,
        login: this.login
    };
    timingsActions = {
        syncProcessTimingsWithServer: this.syncProcessTimingsWithServer,
        addEmptyTiming: this.addEmptyTiming,
        removeTiming: this.removeTiming,
        increasePrecision: this.increasePrecision,
        decreasePrecision: this.decreasePrecision,
        setExactTimingValue: this.setExactTimingValue,
        makeProcessesBackup: this.makeProcessesBackup,
    };
    sendRawQuery = JSONString => this.ws && this.ws.sendRaw( JSONString );
    componentDidMount() {
        const loc = document.location;
        const protocol = loc.protocol[ 4 ] === "s" ? "wss://" : "ws://";
        const WSAdress = protocol + ( loc.port === "3001" ? loc.hostname + ":3000" : loc.host );
        this.ws = new SelfHealingWebSocket( this.downWatcher, this.upWatcher, this.messageParser, WSAdress );
    }
    render() {
        return (
            <GlobalContext.Provider
                value={ {
                    ...this.state,
                    authorizationActions: this.authorizationActions,
                    sendRawQuery: this.sendRawQuery,
                    timingsActions: this.timingsActions
                } }
                children={ this.props.children }
            />
        );
    }
}

export default GlobalContextBasedOnDataFromWS;
