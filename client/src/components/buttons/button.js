import React from 'react';

class Button extends React.Component {
    constructor(){
         super();

         this.state = {
              buttonText: "Button",
              selected: false
         }
    }

    changeColor() {
        if (this.state.selected) {
            console.log("Dont change button color or state")
        }
        else {
            this.setState({selected: !this.state.selected});
            this.props.update();
        }
    }

    toggle() {
        this.setState({selected: false});
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