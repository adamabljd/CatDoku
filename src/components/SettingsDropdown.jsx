import React, { useState } from 'react';
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import soundOn from '../assets/UI/SoundIcon.png'
import soundOff from '../assets/UI/SoundOffIcon.png'
import vibrationON from '../assets/UI/vibrationOn.png'
import vibrationOff from '../assets/UI/vibrationOff.png'
import settingsIcon from '../assets/UI/settingsIcon.png'

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
                 <img src={settingsIcon} alt='settings' className='w-14 h-14'/>
            </button>
            {isDropdownOpen && (
                <div className="absolute left-0 transform -translate-x-[6.3rem] -translate-y-12 w-24 bg-white rounded-md shadow-lg">
                    <div className="p-2 flex flex-row space-x-2">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={toggleSound}
                                className={`rounded-md flex items-center justify-center w-9 h-9 ${soundEnabled ? 'bg-green-400' : 'bg-red-400'}`}
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
                                className={`rounded-md flex items-center justify-center w-9 h-9 ${vibrationEnabled ? 'bg-green-400' : 'bg-red-400'}`}
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
