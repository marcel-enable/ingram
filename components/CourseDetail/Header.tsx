import React from 'react';
import ingramLogo from '../../renderer/ingramLogo.png';
import { CartButton } from '@thoughtindustries/cart';

const Header = () => {
    return (
        <div className="w-full bg-white py-4 px-2">
            <div className="flex flex-row justify-between align-center">
                <div className="basis-1/2">
                    <div className="pl-2">
                        <a href="/" className="flex">
                            <img src={ingramLogo} className="h-11" />
                        </a>
                    </div>
                </div>
                {/* <div className="flex items-center"><CartButton /></div> */}
            </div>
        </div>
    );
};
export default Header;
