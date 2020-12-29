import { PureComponent } from "react";
import Form from "react-bootstrap/Form";

class Input extends PureComponent {
    render() {
        const { name, type, label, placeholder } = this.props;
        return (
            <Form.Group controlId={ name }>
                <Form.Label>
                    { label }
                </Form.Label>
                <Form.Control
                    type={ type }
                    name={ name }
                    required
                    placeholder={ placeholder }
                />
            </Form.Group>
        )
    }
}

export default Input;
