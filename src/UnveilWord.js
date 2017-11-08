import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class UnveilWord extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        prepend: PropTypes.string.isRequired,
        append: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        maskText: PropTypes.bool,
        dir: PropTypes.oneOf([1, -1]),
        charPool: PropTypes.string,
        interval: PropTypes.number,
        component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    };
    static defaultProps = {
        dir: 1,
        prepend: '',
        append: '',
        maskText: true,
        charPool: '#$!%&?~*ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        component: 'span',
        interval: 40
    };
    state = {
        progress: 0,
        maskedText: '',
        currentText: ''
    };
    constructor(props, context) {
        super(props, context);
        this.showNextLetter = this.showNextLetter.bind(this);
        const maskedText = props.maskText ? this.getRandomString(props.text.length, props.charPool) : '';
        this.state = {
            ...this.state,
            maskedText: maskedText,
            currentText: maskedText
        };
    }
    componentDidMount() {
        this._isMounted = true;
        this.intervalID = window.setInterval(this.showNextLetter, this.props.interval);
        this.showNextLetter();
    }
    componentWillUnmount() {
        this._isMounted = false;
        window.clearInterval(this.intervalID);
    }
    render() {
        return React.createElement(this.props.component, {
            className: cx('UnveilWord', this.props.className),
            children: [this.props.prepend, this.state.currentText, this.props.append],
            onClick: this.showNextLetter
        });
    }
    showNextLetter() {
        const { dir, text } = this.props;
        const { progress, maskedText } = this.state;
        const index = dir === 1 ? progress : text.length - progress - 1;
        const leftSource = dir === 1 ? text : maskedText;
        const rightSource = dir === 1 ? maskedText : text;
        const leftPart = leftSource.substr(0, index);
        const rightPart = rightSource.substr(index, rightSource.length - index);
        const nextCurrentText = `${leftPart}${rightPart}`;
        if (nextCurrentText === text) {
            window.clearInterval(this.intervalID);
        }
        this._isMounted &&
            this.setState({
                currentText: nextCurrentText,
                progress: progress + 1
            });
    }

    getRandomString(len, charPool) {
        let text = '';

        for (let i = 0; i < len; i++) {
            text += charPool.charAt(Math.floor(Math.random() * charPool.length));
        }

        return text;
    }
}
