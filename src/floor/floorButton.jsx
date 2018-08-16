import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as directions from '../directions';

class FloorButton extends React.PureComponent {
    static propTypes = {
        level: PropTypes.number,
        direction: PropTypes.string,
        pendingRequest: PropTypes.object,
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
            pendingRequest,
        } = this.props;

        const isActive = pendingRequest && pendingRequest.direction === direction;
        const buttonClasses = classnames('floor-button', {
            'floor-button--active': isActive
        });
        const iconClassNames = classnames('fa', {
            'fa-arrow-circle-up up': direction === directions.UP,
            'fa-arrow-circle-down down': direction === directions.DOWN
        })

        return (
            <button className={buttonClasses} onClick={this.handleButtonClick}>
                <i className={iconClassNames}></i>
            </button>
        );
    }
}

export default FloorButton;