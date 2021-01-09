import React, { Component } from "react";
import getCookie from "../tools/getCookie";
class SelfHealingWebSocket {
    constructor( downCallback, allMessagesHandler, ...initializationArgs ) {
        this.initializationArgs = initializationArgs;
        this.connection = null;
        this.downCallback = downCallback;
        this.allMessagesHandler = function ( event ) {
            const data = JSON.parse( event.data );
            allMessagesHandler( data );
        };
        this.respawnWebSocket();
    }
    closeEL = event => {
        this.downCallback();
        console.log( "[close] Соединение закрыто. Отчёт: ", event );
        setTimeout( this.respawnWebSocket, 3000 );
        // TODO: Добавить нарастающую задержку перед следующим переподключением
    };
    errorEL = function ( error ) {
        console.error( "[error] Ошибка! Отчёт: " );
        console.log( error );
    };
    messageEL = function( event ) {
        console.log( "[message] Сервер отправил сообщение. Отчёт: ", event );
        const data = JSON.parse( event.data );
        console.log( "[message] Данные: ", data );
    };
    openEL = function() {
        console.log( "[open] Соединение установлено" );
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
        if ( this.isAuthSessionChanged() ) {
            localStorage.setItem( "isAuthorized", "false" );
            localStorage.setItem( "fullName", "" );
        } else {
            this.state.isAuthorized = localStorage.getItem( "isAuthorized" ) === "true" || false;
            this.state.fullName = localStorage.getItem( "fullName" ) || "";
        }
        this.ws = null;
    }
    componentDidMount() {
        const loc = document.location;
        const protocol = loc.protocol[ 4 ] === "s" ? "wss://" : "ws://";
        const WSAdress = protocol + ( loc.port === "3001" ? loc.hostname + ":3000" : loc.host );
        this.ws = new SelfHealingWebSocket( this.downWatcher, this.messageParser, WSAdress );
    }
    downWatcher = () => {
        this.setState( ps => ( {
            ...ps,
            isFarmConnected: null
        } ) );
    }
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
                this.setState( ps => ( {
                    ...ps,
                    records: data.package
                } ) );
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
                localStorage.setItem( "isAuthorized", "true" );
                localStorage.setItem( "fullName", data.reply.fullName );
                this.setState( ps => ( {
                    ...ps,
                    isAuthorized: true,
                    fullName: data.reply.fullName,
                    isRegistrationAllowed: false
                } ) );
                break;
            case "logout":
                localStorage.setItem( "isAuthorized", "" + false );
                localStorage.setItem( "fullName", "" );
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
            case "warning":
            case "records":
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
        if ( isNaN( intValue ) ) return time;
        time[ index ] = intValue > maxs[ index ] ? maxs[ index ] : intValue < 0 ? 0 : intValue;
        return time;
    });
    isAuthSessionChanged = () => false && ( localStorage.getItem( "connect.sid" ) !== getCookie( "connect.sid" ) );
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
    sendRawQuery = JSONString => this.ws && this.ws.sendRaw( JSONString );
    render() {
        return (
            <GlobalContext.Provider
                value={ {
                    ...this.state,
                    authorizationActions: this.authorizationActions,
                    sendRawQuery: this.sendRawQuery,
                    timingsActions: {
                        syncProcessTimingsWithServer: this.syncProcessTimingsWithServer,
                        addEmptyTiming: this.addEmptyTiming,
                        removeTiming: this.removeTiming,
                        increasePrecision: this.increasePrecision,
                        decreasePrecision: this.decreasePrecision,
                        setExactTimingValue: this.setExactTimingValue,
                    }
                } }
                children={ this.props.children }
            />
        );
    }
}

export default GlobalContextBasedOnDataFromWS;
