import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div className="container">
        <h1 className='ubuntu title'>About Us</h1>
        <p className='ubuntu info'>Crowd Control is a complete end-to-end solution that offers real time
        people counting and trend analysis for closed locations.  Every step of the
        product is made with ease of use in mind.  It begins with an affordable
        device (sensor and microcontroller), which pairs with a user friendly web
        application.  A complete poduct with both the hardware and software working
        together seamlessly out of the box allows for it to be used for businesses,
        universities, restaurants, private homes, and everything in between.  The
        all in one functionality and inexpensive cost sets us apart from any other
        people counters on the market.</p>
        <h3 className='ubuntu desc'>Meet the team!</h3>
        <div className='row ubuntu'>
          <div className='col-md-3'><span className='info'>Joseph Lally</span></div>
          <div className='col-md-3'><span className='info'>Yuval Shatil</span></div>
          <div className='col-md-3'><span className='info'>Justin Vincelette</span></div>
          <div className='col-md-3'><span className='info'>Victor Liang</span></div>
        </div>
        <div className='row ubuntu'>
          <div className='col-md-3'><span className='info'>Afolabi Kolawole</span></div>
          <div className='col-md-3'><span className='info'>Richard Yeung</span></div>
          <div className='col-md-3'><span className='info'>Andy Gonzalez</span></div>
          <div className='col-md-3'><span className='info'>David Masi</span></div>
        </div>
      </div>
    );
  }
}

export default About;
