import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as directions from '../directions';

class FloorButton extends React.PureComponent {
    static propTypes = {
        level: PropTypes.number,
        direction: PropTypes.string,
        pendingRequests: PropTypes.array,
        onClick: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick() {
        const {
            level,
            direction,
            onClick,
        } = this.props;

        onClick(level, direction);
    }

    render() {
        const {
            level,
            direction,
            pendingRequests,
        } = this.props;
        const isUp = direction === directions.UP;
        const isActive = Boolean(pendingRequests.find((pendingRequest) => pendingRequest.direction === direction));
        const buttonClasses = classnames('building__floor-indicator', {
            'building__floor-indicator--up': isUp,
            'building__floor-indicator--down': !isUp,
            'building__floor-indicator--is-active': isActive
        })

        return (
            <button className={buttonClasses} onClick={this.handleButtonClick}>
                <div></div>
            </button>
        );
    }
}

export default FloorButton;