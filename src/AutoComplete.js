import React, { Component } from 'react';
import FormControl from 'bee-form-control';
import PropTypes from 'prop-types';

const propTypes = {
    value: PropTypes.any,
    options: PropTypes.array,
    onChange: PropTypes.func
};
const defaultProps = {
    value: "",
    options: [],
    clsPrefix: 'u-autocomplete'
};

class AutoComplete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false, //控制自动匹配列表的显示与隐藏
            displayValue: '',
            activeItemIndex: -1,
            options: props.options,
            value: props.value,
            placeholder: props.placeholder
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleChangeList = this.handleChangeList.bind(this);
        this.moveItem = this.moveItem.bind(this);
        this.handLeBlur = this.handLeBlur.bind(this);
    }
    componentWillReceiveProps(props) {
        if ('value' in props) {
            let value = props.value;
            this.setState({
                value: value
            })
        }
        if ('options' in props) {
            let options = props.options;
            this.setState({
                options: options
            })
        }
    }

    handleChange(value) {
        let arr = [];
        let valueArr = this.props.options;
        valueArr.sort();
        if (value.replace(/(^\s*)|(\s*$)/g, '') == "") {
            this.setState({
                value: "",
                activeItemIndex: -1,
                show: false
            })
            this.props.onValueChange(value);
            return;
        }

        for (var i = 0; i < valueArr.length; i++) {
            if (valueArr[i].indexOf(value) != -1) {
                arr.push(valueArr[i]);
            }
        }
        this.setState({
            options: arr,
            show: true,
            activeItemIndex: -1,
            displayValue: '',
            value: value
        })
        this.props.onValueChange(value);
    }
    /**
     * 自动匹配的列表被选中其中某一个
     * @param {*} value 
     */
    handleChangeList(value) {
        this.setState({
            show: false,
            displayValue: ''
        })
        this.props.onValueChange(value);
    }

    handleKeyDown(e) {
        const { activeItemIndex } = this.state;
        const { options } = this.props;

        switch (e.keyCode) {
            // 13为回车键的键码（keyCode）
            case 13: {
                this.setState({
                    show: false
                })
                break;
            }
            // 38为上方向键，40为下方向键
            case 38:
            case 40: {
                e.preventDefault();
                // 使用moveItem方法对更新或取消选中项
                this.moveItem(e.keyCode === 38 ? 'up' : 'down');
                break;
            }
        }
    }
    
    moveItem(direction) {
        const { activeItemIndex, options } = this.state;
        const lastIndex = options.length - 1;
        let newIndex = -1;

        // 计算新的activeItemIndex
        if (direction === 'up') {
            if (activeItemIndex === -1) {
                // 如果没有选中项则选择最后一项
                newIndex = lastIndex;
            } else {
                newIndex = activeItemIndex - 1;
            }
        } else {
            if (activeItemIndex < lastIndex) {
                newIndex = activeItemIndex + 1;
            }
        }

        // 获取新的displayValue
        let newDisplayValue = '';
        if (newIndex >= 0) {
            newDisplayValue = options[newIndex];
        }

        // 更新状态
        this.setState({
            displayValue: newDisplayValue,
            activeItemIndex: newIndex
        });
    }

    handleEnter(index) {
        const currentItem = this.props.options[index];
        this.setState({ activeItemIndex: index, displayValue: currentItem });
    }

    handleLeave() {
        this.setState({ activeItemIndex: -1, displayValue: '' });
    }
    handLeBlur() {
        this.setState({
            show: false
        });
    }
    render() {
        const { show, displayValue, activeItemIndex, options, value, placeholder } = this.state;
        const { disabled, clsPrefix } = this.props;
        return (
            <div className={clsPrefix}>
                <FormControl
                    value={displayValue || value}
                    disabled={disabled }
                    onChange={(value) => {this.handleChange(value)}}
                    onKeyDown={this.handleKeyDown}
                    placeholder={placeholder}
                    onBlur={this.handLeBlur}
                />
                {show && options.length > 0 && (
                    <ul className={`${clsPrefix}-options`} onMouseLeave={this.handleLeave}>
                        {
                            options.map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={index === activeItemIndex ? "active" : ''}
                                        onMouseEnter={() => this.handleEnter(index)}
                                        onClick={() => this.handleChangeList(item)}
                                    >
                                        {item.text || item}
                                    </li>
                                );
                            })
                        }
                    </ul>
                )}
            </div>
        );
    }
}


AutoComplete.propTypes = propTypes;
AutoComplete.defaultProps = defaultProps;
export default AutoComplete;