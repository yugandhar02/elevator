import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ElevatorButton extends React.PureComponent {
    static propTypes = {
        floorNumber: PropTypes.number,
        destinationRequests: PropTypes.array,
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
            destinationRequests,
        } = this.props;

        const isActive = destinationRequests.find((destinationRequest) => destinationRequest === floorNumber);
        const buttonClasses = classnames('building__elevator-button', {
            'building__elevator-button--active': isActive
        });

        return (
            <button className={buttonClasses} onClick={this.handleButtonClick}>
                <span>{floorNumber}</span>
            </button>
        );
    }
}

export default ElevatorButton;