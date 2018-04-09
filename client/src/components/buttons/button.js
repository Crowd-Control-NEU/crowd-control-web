import React from 'react';

class Button extends React.Component {
    constructor(props){
         super(props);

         this.state = {
              buttonText: "Button",
              selected: props.active
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
        let bgColor = this.state.selected ? "#D4AA12" : "#0B3C5D"

        return (
             <div>
                 <button style={{backgroundColor: bgColor, color: 'white'}} onClick={this.changeColor.bind(this)} className='button'>{this.props.text}</button>
             </div>
        )
    }
}

export default Button
