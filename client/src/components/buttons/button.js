import React from 'react';

class Button extends React.Component {
    constructor(){
         super();

         this.state = {
              buttonText: "Button",
              selected: true
         }
    }

    changeColor(){
        this.setState({selected: !this.state.selected})
    }

    nameButton(name){
        this.setState( {buttonText: name})
    }

    render(){
        let bgColor = this.state.selected ? "red" : "white"

        return (
             <div>
                 <button style={{backgroundColor: bgColor}} onClick={this.changeColor.bind(this)}>{this.props.text}</button>
             </div>
        )
    }
}

export default Button