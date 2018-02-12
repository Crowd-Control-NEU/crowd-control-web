import React from 'react';

class Button extends React.Component {
    constructor(){
         super();

         this.state = {
              buttonText: "Button",
              selected: true
         }
    }

    changeColor() {
        this.setState({selected: !this.state.selected});
        this.props.update();
    }

    render(){
        let bgColor = this.state.selected ? "orange" : "grey"

        return (
             <div>
                 <button style={{backgroundColor: bgColor}} onClick={this.changeColor.bind(this)}>{this.props.text}</button>
             </div>
        )
    }
}

export default Button