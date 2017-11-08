import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import UnveilWord from './UnveilWord';

export default class UnveilText extends React.PureComponent {

    static propTypes = {
        className: PropTypes.string,
        text: PropTypes.string.isRequired,
        maskText: PropTypes.bool,
        wordInterval: PropTypes.number,
        letterInterval: PropTypes.number
    };

    static defaultProps = {
        maskText: true,
        wordInterval: 30
    };

    state = {
        progress: 0,
        words: []
    };

    constructor(props, context) {
        super(props, context);
        this.showNextWord = this.showNextWord.bind(this);
        this.state = {
            ...this.state,
            words: props.text.split(' ').map((word, id) => ({ word, id }))
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.intervalID = window.setInterval(this.showNextWord, this.props.wordInterval);
        this.showNextWord();
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.clearInterval(this.intervalID);
    }

    render() {
        const { maskText } = this.props;
        return (
            <div className={cx(this.props.className, 'UnveilText')}>
                {this.state.words
                    .slice(0, this.state.progress)
                    .map(({ word, id }) => (
                        <UnveilWord key={id} interval={this.props.letterInterval} text={word} append={' '} maskText={maskText} />
                    ))}
            </div>
        );
    }

    showNextWord() {
        const nextProgress = this.state.progress + 1;
        if (nextProgress === this.state.words.length) {
            window.clearInterval(this.intervalID);
        }
        this.setState({
            progress: nextProgress
        });
    }
}
