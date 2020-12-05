// import serverError from "./serverError";

async function loader( body, address ) {
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
        // const { isError, info } = data.report;
        // const { errorField } = data.reply;
        return data;
    } catch ( error ) {
        console.log( "error: ", error );
        return {
            report: {
                isError:true,
                info: "Ошибка подключения"
            }
        };
    }
}

export default loader;
