function calcSecondsFrom00_00( [ hours, minutes, seconds ] ) {
    return ( ~~hours * 60 + ~~minutes ) * 60 + ~~seconds;
}

export default calcSecondsFrom00_00;
