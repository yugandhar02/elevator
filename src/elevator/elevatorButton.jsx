import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ElevatorButton extends React.PureComponent {
    static propTypes = {
        floorNumber: PropTypes.number,
        requests: PropTypes.array,
        onClick: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick() {
        const {
            floorNumber,
            onClick,
        } = this.props;

        onClick(floorNumber);
    }

    render() {
        const {
            floorNumber,
            requests,
        } = this.props;

        const isActive = requests.find((stopage) => stopage === floorNumber);
        const buttonClasses = classnames('elevator-button', {
            'elevator-button--active': isActive
        });

        return (
            <button className={buttonClasses} onClick={this.handleButtonClick}>
                <span>{floorNumber}</span>
            </button>
        );
    }
}

export default ElevatorButton;