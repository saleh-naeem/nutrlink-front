import React from 'react'
import './LoadingOverlay.css'

const LoadingOverlay = ({ message = "Loading...", isActive = false }) => {
    if (!isActive) return null

    return (
        <div className="loading-overlay" role="alert" aria-busy="true">
            <div className="spinner"></div>
            <p className="loading-text">{message}</p>
        </div>
    )
}

export default LoadingOverlay