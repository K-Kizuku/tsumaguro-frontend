// 'use client';
// import React, { useEffect, useState, useRef } from 'react';
// import {
//   CallClient,
//   VideoStreamRenderer,
//   LocalVideoStream
//   // AzureCommunicationTokenCredential
// } from '@azure/communication-calling';
// import { AzureCommunicationTokenCredential } from '@azure/communication-common';
// import { AzureLogger, setLogLevel } from '@azure/logger';

// const Streaming = () => {
//   // Set the log level and output
//   // setLogLevel('verbose');
//   // AzureLogger.log = (...args) => {
//   //   console.log(...args);
//   // };
//   const initializeCallAgentButtonRef = useRef(null);
//   const startCallButtonRef = useRef(null);
//   const hangUpButtonRef = useRef(null);
//   const localVideoContainerRef = useRef(null);
//   const acceptCallButtonRef = useRef(null);
//   const [callAgent, setCallAgent] = useState(null);
//   const [deviceManager, setDeviceManager] = useState(null);
//   const [call, setCall] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [localVideoStream, setLocalVideoStream] = useState(null);
//   const [localVideoStreamRenderer, setLocalVideoStreamRenderer] =
//     useState(null);
//   const [userAccessToken, setUserAccessToken] = useState(
//     'eyJhbGciOiJSUzI1NiIsImtpZCI6IjVFODQ4MjE0Qzc3MDczQUU1QzJCREU1Q0NENTQ0ODlEREYyQzRDODQiLCJ4NXQiOiJYb1NDRk1kd2M2NWNLOTVjelZSSW5kOHNUSVEiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOmE1YWFmZjlhLWFlY2ItNGRkYi04MmZjLWFiMmYyZDBiZjk0NF8wMDAwMDAxOC1kNmU1LTZjOWMtZDEwNy01NzQ4MjIwMDI5NDAiLCJzY3AiOjE3OTIsImNzaSI6IjE2ODQ1NTAxNzQiLCJleHAiOjE2ODQ2MzY1NzQsInJnbiI6ImpwIiwiYWNzU2NvcGUiOiJ2b2lwIiwicmVzb3VyY2VJZCI6ImE1YWFmZjlhLWFlY2ItNGRkYi04MmZjLWFiMmYyZDBiZjk0NCIsInJlc291cmNlTG9jYXRpb24iOiJqYXBhbiIsImlhdCI6MTY4NDU1MDE3NH0.kIiDxJXhU8TrAUr94zOErcKtX3TaZ1kZiC_5tTwRhkp4tFf0stHkXBxYVmTx9Y43VCLgXml-MC34DJKrdL-gTjGg87efBtNotPfPxARG5XVV8gWufHpEQkasOnYC3aO004JoQdTzgOqgvX4qSe3KZve1-sm6zg32M8ihZEhEiRJ7PUvYuLFozNBOM1kkNcPgfbZ2j_wUcI1f_mZ71qgXcBwMEVHzyHyqfGiNDVcQG75-eIZ17X99EOWrIFh9H6_yYRfr12WT94MFy7XT3id1Jt7l9Ii-4ph3Ao4mjhoo-pqNUJAlKgVPkqvN_IlHQQHe9joiQx6n8svPjgjNw5CK6A'
//   );
//   const [calleeAcsUserId, setCalleeAcsUserId] = useState(
//     '8:acs:a5aaff9a-aecb-4ddb-82fc-ab2f2d0bf944_00000018-d6e5-6c9c-d107-574822002940'
//   );

//   useEffect(() => {
//     const initializeCallAgent = async () => {
//       try {
//         const callClient = new CallClient();
//         const tokenCredential = new AzureCommunicationTokenCredential(
//           userAccessToken.trim()
//         );
//         const agent = await callClient.createCallAgent(tokenCredential);

//         // Set up a camera device to use.
//         const manager = await callClient.getDeviceManager();
//         await manager.askDevicePermission({
//           video: true,
//           audio: true
//         });
//         // await manager.askDevicePermission({ audio: true });

//         // Listen for an incoming call to accept.
//         agent.on('incomingCall', async (args) => {
//           try {
//             setIncomingCall(args.incomingCall);
//           } catch (error) {
//             console.error(error);
//           }
//         });

//         setCallAgent(agent);
//         setDeviceManager(manager);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     initializeCallAgent();
//   }, []);

//   const createLocalVideoStream = async () => {
//     const cameras = await deviceManager.getCameras();
//     if (cameras.length > 0) {
//       return new LocalVideoStream(cameras[0]);
//     } else {
//       console.error('No camera device found on the system');
//     }
//   };

//   const displayLocalVideoStream = async () => {
//     try {
//       const renderer = new VideoStreamRenderer(localVideoStream);
//       const view = await renderer.createView();
//       setLocalVideoStreamRenderer(renderer);
//       localVideoContainerRef.current.appendChild(view.target);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const removeLocalVideoStream = async () => {
//     try {
//       localVideoStreamRenderer.dispose();
//       setLocalVideoStreamRenderer(null);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleInitializeCallAgentClick = async () => {
//     try {
//       const localVideoStream = await createLocalVideoStream();
//       setLocalVideoStream(localVideoStream);
//       await displayLocalVideoStream();

//       startCallButtonRef.current.disabled = false;
//       initializeCallAgentButtonRef.current.disabled = true;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleStartCallClick = async () => {
//     try {
//       const localVideoStream = await createLocalVideoStream();
//       setLocalVideoStream(localVideoStream);

//       const videoOptions = localVideoStream
//         ? { localVideoStreams: [localVideoStream] }
//         : null;
//       const callOptions = {
//         videoOptions
//       };
//       const call = callAgent.startCall([calleeAcsUserId], callOptions);
//       setCall(call);

//       startCallButtonRef.current.disabled = true;
//       hangUpButtonRef.current.disabled = false;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleAcceptCallClick = async () => {
//     try {
//       const localVideoStream = await createLocalVideoStream();
//       const videoOptions = localVideoStream
//         ? { localVideoStreams: [localVideoStream] }
//         : undefined;
//       let temp = await incomingCall.accept({ videoOptions });
//       setCall(temp);
//       // Subscribe to the call's properties and events.
//       subscribeToCall(call);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   /**
//    * Subscribe to a call obj.
//    * Listen for property changes and collection updates.
//    */
//   const subscribeToCall = (call) => {
//     try {
//       // Inspect the initial call.id value.
//       console.log(`Call Id: ${call.id}`);
//       //Subscribe to call's 'idChanged' event for value changes.
//       call.on('idChanged', () => {
//         console.log(`Call Id changed: ${call.id}`);
//       });

//       // Inspect the initial call.state value.
//       console.log(`Call state: ${call.state}`);
//       // Subscribe to call's 'stateChanged' event for value changes.
//       call.on('stateChanged', async () => {
//         console.log(`Call state changed: ${call.state}`);
//         // if (call.state === 'Connected') {
//         //   connectedLabel.hidden = false;
//         //   acceptCallButton.disabled = true;
//         //   startCallButton.disabled = true;
//         //   hangUpCallButton.disabled = false;
//         //   startVideoButton.disabled = false;
//         //   stopVideoButton.disabled = false;
//         //   remoteVideosGallery.hidden = false;
//         // } else if (call.state === 'Disconnected') {
//         //   connectedLabel.hidden = true;
//         //   startCallButton.disabled = false;
//         //   hangUpCallButton.disabled = true;
//         //   startVideoButton.disabled = true;
//         //   stopVideoButton.disabled = true;
//         //   console.log(
//         //     `Call ended, call end reason={code=${call.callEndReason.code}, subCode=${call.callEndReason.subCode}}`
//         //   );
//         // }
//       });

//       call.localVideoStreams.forEach(async (lvs) => {
//         setLocalVideoStream(lvs);
//         await displayLocalVideoStream();
//       });
//       call.on('localVideoStreamsUpdated', (e) => {
//         e.added.forEach(async (lvs) => {
//           setLocalVideoStream(lvs);
//           await displayLocalVideoStream();
//         });
//         e.removed.forEach((lvs) => {
//           removeLocalVideoStream();
//         });
//       });

//       // Inspect the call's current remote participants and subscribe to them.
//       call.remoteParticipants.forEach((remoteParticipant) => {
//         subscribeToRemoteParticipant(remoteParticipant);
//       });
//       // Subscribe to the call's 'remoteParticipantsUpdated' event to be
//       // notified when new participants are added to the call or removed from the call.
//       call.on('remoteParticipantsUpdated', (e) => {
//         // Subscribe to new remote participants that are added to the call.
//         e.added.forEach((remoteParticipant) => {
//           subscribeToRemoteParticipant(remoteParticipant);
//         });
//         // Unsubscribe from participants that are removed from the call
//         e.removed.forEach((remoteParticipant) => {
//           console.log('Remote participant removed from the call.');
//         });
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   /**
//    * Subscribe to a remote participant obj.
//    * Listen for property changes and collection udpates.
//    */
//   const subscribeToRemoteParticipant = (remoteParticipant) => {
//     try {
//       // Inspect the initial remoteParticipant.state value.
//       console.log(`Remote participant state: ${remoteParticipant.state}`);
//       // Subscribe to remoteParticipant's 'stateChanged' event for value changes.
//       remoteParticipant.on('stateChanged', () => {
//         console.log(
//           `Remote participant state changed: ${remoteParticipant.state}`
//         );
//       });

//       // Inspect the remoteParticipants's current videoStreams and subscribe to them.
//       remoteParticipant.videoStreams.forEach((remoteVideoStream) => {
//         subscribeToRemoteVideoStream(remoteVideoStream);
//       });
//       // Subscribe to the remoteParticipant's 'videoStreamsUpdated' event to be
//       // notified when the remoteParticiapant adds new videoStreams and removes video streams.
//       remoteParticipant.on('videoStreamsUpdated', (e) => {
//         // Subscribe to new remote participant's video streams that were added.
//         e.added.forEach((remoteVideoStream) => {
//           subscribeToRemoteVideoStream(remoteVideoStream);
//         });
//         // Unsubscribe from remote participant's video streams that were removed.
//         e.removed.forEach((remoteVideoStream) => {
//           console.log('Remote participant video stream was removed.');
//         });
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   /**
//    * Subscribe to a remote participant's remote video stream obj.
//    * You have to subscribe to the 'isAvailableChanged' event to render the remoteVideoStream. If the 'isAvailable' property
//    * changes to 'true', a remote participant is sending a stream. Whenever availability of a remote stream changes
//    * you can choose to destroy the whole 'Renderer', a specific 'RendererView' or keep them, but this will result in displaying blank video frame.
//    */
//   const subscribeToRemoteVideoStream = async (remoteVideoStream) => {
//     let renderer = new VideoStreamRenderer(remoteVideoStream);
//     let view;
//     let remoteVideoContainer = document.createElement('div');
//     remoteVideoContainer.className = 'remote-video-container';

//     /**
//    * isReceiving API is currently a @beta feature.
//    * To use this api, please use 'beta' version of Azure Communication Services Calling Web SDK.
//    * Create a CSS class to style your loading spinner.
//    *
//   let loadingSpinner = document.createElement('div');
//   loadingSpinner.className = 'loading-spinner';
//   remoteVideoStream.on('isReceivingChanged', () => {
//       try {
//           if (remoteVideoStream.isAvailable) {
//               const isReceiving = remoteVideoStream.isReceiving;
//               const isLoadingSpinnerActive = remoteVideoContainer.contains(loadingSpinner);
//               if (!isReceiving && !isLoadingSpinnerActive) {
//                   remoteVideoContainer.appendChild(loadingSpinner);
//               } else if (isReceiving && isLoadingSpinnerActive) {
//                   remoteVideoContainer.removeChild(loadingSpinner);
//               }
//           }
//       } catch (e) {
//           console.error(e);
//       }
//   });
//   */

//     const createView = async () => {
//       // Create a renderer view for the remote video stream.
//       view = await renderer.createView();
//       // Attach the renderer view to the UI.
//       remoteVideoContainer.appendChild(view.target);
//       remoteVideosGallery.appendChild(remoteVideoContainer);
//     };

//     // Remote participant has switched video on/off
//     remoteVideoStream.on('isAvailableChanged', async () => {
//       try {
//         if (remoteVideoStream.isAvailable) {
//           await createView();
//         } else {
//           view.dispose();
//           remoteVideosGallery.removeChild(remoteVideoContainer);
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     });

//     // Remote participant has video on initially.
//     if (remoteVideoStream.isAvailable) {
//       try {
//         await createView();
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   };

//   /**
//    * Start your local video stream.
//    * This will send your local video stream to remote participants so they can view it.
//    */
//   // startVideoButton.onclick = async () => {
//   //   try {
//   //     const localVideoStream = await createLocalVideoStream();
//   //     await call.startVideo(localVideoStream);
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   /**
//    * Stop your local video stream.
//    * This will stop your local video stream from being sent to remote participants.
//    */
//   const onClickStopVideoButton = async () => {
//     try {
//       await call.stopVideo(localVideoStream);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   /**
//    * To render a LocalVideoStream, you need to create a new instance of VideoStreamRenderer, and then
//    * create a new VideoStreamRendererView instance using the asynchronous createView() method.
//    * You may then attach view.target to any UI element.
//    */
//   // const createLocalVideoStream = async () => {
//   //   const camera = (await deviceManager.getCameras())[0];
//   //   if (camera) {
//   //     return new LocalVideoStream(camera);
//   //   } else {
//   //     console.error(`No camera device found on the system`);
//   //   }
//   // };

//   /**
//    * Display your local video stream preview in your UI
//    */
//   // const displayLocalVideoStream = async () => {
//   //   try {
//   //     const temp = new VideoStreamRenderer(localVideoStream);
//   //     setLocalVideoStreamRenderer(temp);
//   //     const view = await localVideoStreamRenderer.createView();
//   //     localVideoContainer.hidden = false;
//   //     localVideoContainer.appendChild(view.target);
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   /**
//    * Remove your local video stream preview from your UI
//    */
//   // const removeLocalVideoStream = async () => {
//   //   try {
//   //     localVideoStreamRenderer.dispose();
//   //     localVideoContainer.hidden = true;
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   const handleHangUpClick = async () => {
//     try {
//       if (call) {
//         call.hangUp();
//         setCall(null);
//         removeLocalVideoStream();

//         startCallButtonRef.current.disabled = false;
//         hangUpButtonRef.current.disabled = true;
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleAcceptIncomingCall = async () => {
//     try {
//       const localVideoStream = await createLocalVideoStream();
//       setLocalVideoStream(localVideoStream);

//       const videoOptions = localVideoStream
//         ? { localVideoStreams: [localVideoStream] }
//         : null;
//       const acceptCallOptions = {
//         videoOptions
//       };
//       incomingCall.accept(acceptCallOptions);

//       setCall(incomingCall);
//       setIncomingCall(null);

//       startCallButtonRef.current.disabled = true;
//       hangUpButtonRef.current.disabled = false;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h1>Video Calling App</h1>
//       <div>
//         <label>User Access Token:</label>
//         <input
//           type='text'
//           value={userAccessToken}
//           onChange={(e) => setUserAccessToken(e.target.value)}
//         />
//         <br />
//         <label>Callee ACS User ID:</label>
//         <input
//           type='text'
//           value={calleeAcsUserId}
//           onChange={(e) => setCalleeAcsUserId(e.target.value)}
//         />
//       </div>
//       <br />
//       <button
//         onClick={handleInitializeCallAgentClick}
//         ref={initializeCallAgentButtonRef}
//       >
//         Initialize Call Agent
//       </button>
//       <br />
//       <button onClick={handleStartCallClick} ref={startCallButtonRef}>
//         Start Call
//       </button>
//       <br />
//       <button onClick={handleAcceptCallClick} ref={acceptCallButtonRef}>
//         Accept Call
//       </button>
//       <br />
//       <button onClick={handleHangUpClick} ref={hangUpButtonRef}>
//         Hang Up
//       </button>
//       <br />
//       {incomingCall && (
//         <div>
//           <h2>Incoming Call</h2>
//           <button onClick={handleAcceptIncomingCall}>Accept</button>
//         </div>
//       )}
//       <div ref={localVideoContainerRef}></div>
//     </div>
//   );
// };

// export default Streaming;
