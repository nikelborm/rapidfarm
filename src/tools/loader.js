import serverError from "./serverError";

async function loader( body, address ) {
    let isError;
    let info;
    let errorField;
    try {
        const data = await (
            await fetch(
                document.location.origin + address,
                {
                    method: "post",
                    body: JSON.stringify(body),
                    headers: new Headers( {
                        "Content-Type": "application/json"
                    } )
                }
            )
        ).json();
        console.log( data );
        // return data;
        if ( data.report.isError ) {
            ({isError, info, errorField } = data.report);
        } else {
            return data;
        }
    } catch ( error ) {
        console.log( "error: ", error );
        isError = true;
        info = "Клиентская ошибка (плохое соединение или сервер прислал то, что нельзя обработать)";
        errorField = "submitButton"; // TODO: Подумать над  этим
    }
    if ( isError ) {
        throw new serverError( info, errorField )
    }
}

export default loader;
