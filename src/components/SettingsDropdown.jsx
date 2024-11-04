import React, { useState } from 'react';
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import soundOn from '../assets/icons/soundOn.svg'
import soundOff from '../assets/icons/soundOff.svg'
import vibrationON from '../assets/icons/vibrationOn.svg'
import vibrationOff from '../assets/icons/vibrationOff.svg'
import settingsIcon from '../assets/icons/settingsIcon.svg'

const SettingsDropdown = ({ soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Toggle sound on or off
    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
    };

    // Toggle vibration on or off
    const toggleVibration = () => {
        setVibrationEnabled(!vibrationEnabled);
        if (!vibrationEnabled) {
            Haptics.impact({ style: ImpactStyle.Medium }).catch(error => console.log("Vibration error:", error));
        }
    };

    // Open/close dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative inline-block text-left">
            <button onClick={toggleDropdown} className=" flex items-center justify-center">
                 <img src={settingsIcon} alt='settings' className='w-7 h-7 mt-1'/>
            </button>
            {isDropdownOpen && (
                <div className="absolute md:left-1/2 transform -translate-x-1/2 w-12 mt-1 bg-white rounded-md shadow-lg">
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-2">
                            <button
                                onClick={toggleSound}
                                className={`p-1 rounded-md ${soundEnabled ? 'bg-green-400' : 'bg-red-400'}`}
                            >
                                <img
                                    src={soundEnabled ? soundOn : soundOff}
                                    alt="Sound Icon"
                                    className="h-6 w-6"
                                />
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={toggleVibration}
                                className={`p-1 rounded-md ${vibrationEnabled ? 'bg-green-400' : 'bg-red-400'}`}
                            >
                                <img
                                    src={vibrationEnabled ? vibrationON : vibrationOff}
                                    alt="Vibration Icon"
                                    className="h-6 w-6"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsDropdown;
