// import React, { useEffect, useContext } from 'react';
// import { addWatermark, disableShortcuts } from '../utils/protector';
// import { detectScreenCapture } from '../utils/detector';
// import { AuthContext } from '../context/AuthContext';

// const ProtectedContent = ({ children }) => {
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     disableShortcuts();
//     addWatermark(user?.id || 'anonymous');
//     // detectScreenCapture(); // Disabled to avoid permission prompts

//     return () => {
//       document.removeEventListener('contextmenu', () => {});
//       document.removeEventListener('keydown', () => {});
//     };
//   }, [user]);

//   return <div className="protected-content">{children}</div>;
// };

// export default ProtectedContent;