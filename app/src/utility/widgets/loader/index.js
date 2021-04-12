import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

class Loaders extends Component {
    render() {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: 'fixed',
                width: '100%',
                height: '100%',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: '2',
                cursor: 'pointer'
            }}>
                <Loader
                    type="Puff"
                    color="#00bcff"
                    height={100}
                    width={100}
                />
            </div>
        );
    }
}

export default Loaders;

