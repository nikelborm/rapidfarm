import React, { Component } from "react";

class OneTimeChanger extends Component {
    render() {
        const { role } = this.props;
        return (
            <>
                <InputGroup.Prepend>
                    <InputGroup.Text>
                        { role }
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    name="command"
                    type="text"
                    placeholder="Не пишите, если не уверены"
                />
                <InputGroup.Append>
                    <Button variant="primary" type="submit">
                        Отправить
                    </Button>
                </InputGroup.Append>
            </>
        );
    }
}

export default OneTimeChanger;
