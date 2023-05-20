// Creating the LiveEvent - the primary object for live streaming in AMS.
// See the overview - https://docs.microsoft.com/azure/media-services/latest/live-streaming-overview

// Create the LiveEvent

// Understand the concepts of what a live event and a live output is in AMS first!
// Read the following - https://docs.microsoft.com/azure/media-services/latest/live-events-outputs-concept
// 1) Understand the billing implications for the various states
// 2) Understand the different live event types, pass-through and encoding
// 3) Understand how to use long-running async operations
// 4) Understand the available Standby mode and how it differs from the Running Mode.
// 5) Understand the differences between a LiveOutput and the Asset that it records to.  They are two different concepts.
//    A live output can be considered as the "tape recorder" and the Asset is the tape that is inserted into it for recording.
// 6) Understand the advanced options such as low latency, and live transcription/captioning support.
//    Live Transcription - https://docs.microsoft.com/en-us/azure/media-services/latest/live-transcription
//    Low Latency - https://docs.microsoft.com/en-us/azure/media-services/latest/live-event-latency

// When broadcasting to a live event, please use one of the verified on-premises live streaming encoders.
// While operating this tutorial, it is recommended to start out using OBS Studio before moving to another encoder.

// Note: When creating a LiveEvent, you can specify allowed IP addresses in one of the following formats:
//      To allow all IPv4 addresses and block all IPv6 addresses, set the IP allow list to [ "0.0.0.0/0" ]
//      IpV4 address with 4 numbers
//      CIDR address range
import {
  IPRange,
  LiveEventInputAccessControl,
  LiveEventPreview,
  LiveEvent,
  KnownLiveEventInputProtocol,
  KnownLiveEventEncodingType,
  mediaAccount,
  mediaServicesClient,
  longRunningOperationUpdateIntervalMs
} from '@azure/arm-mediaservices';

export const rtmp = () => {
  let allowAllIPv4InputRange: IPRange = {
    name: 'Allow all IPv4 addresses',
    address: '0.0.0.0/0',
    subnetPrefixLength: 0
  };

  // IpV6 addresses or ranges
  //  For this example, the following request from the following addresses will be accepted:
  //      •	IPv6 addresses between 2001:1234:1234:0000:0000:0000:0000:4567 and 2001:1234:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF,
  //      •	IPv6 address 2001:1235:0000:0000:0000:0000:0000:0000
  //  Additional examples:
  //      •	To allow requests from any IP address, set the “defaultAction” of the “accessControl” block to “Allow” (and do not specify an “ipAllowList)
  //      •	To allow all IPv6 addresses and block all IPv6 addresses, set the IP allow list to [ "::/0" ]

  let allowAllIPv6InputRange: IPRange = {
    name: 'Allow all IPv6 addresses',
    address: '::',
    subnetPrefixLength: 0
  };

  // Create the LiveEvent input IP access control object
  // this will control the IP that the encoder is running on and restrict access to only that encoder IP range.
  let liveEventInputAccess: LiveEventInputAccessControl = {
    ip: {
      allow: [
        // re-use the same range here for the sample, but in production you can lock this
        // down to the ip range for your on-premises live encoder, laptop, or device that is sending
        // the live stream
        allowAllIPv4InputRange,
        allowAllIPv6InputRange
      ]
    }
  };

  // Create the LiveEvent Preview IP access control object.
  // This will restrict which clients can view the preview endpoint
  let liveEventPreview: LiveEventPreview = {
    accessControl: {
      ip: {
        allow: [
          // re-use the same range here for the sample, but in production you can lock this to the IPs of your
          // devices that would be monitoring the live preview.
          allowAllIPv4InputRange,
          allowAllIPv6InputRange
        ]
      }
    }
  };

  // To get the same ingest URL for the same LiveEvent name every single time...
  // 1. Set useStaticHostname  to true so you have ingest like:
  //        rtmps://liveevent-hevc12-eventgridmediaservice-usw22.channel.media.azure.net:2935/live/522f9b27dd2d4b26aeb9ef8ab96c5c77
  // 2. Set accessToken to a desired GUID string (with or without hyphen)

  // See REST API documentation for details on each setting value
  // https://docs.microsoft.com/rest/api/media/liveevents/create

  let liveEventCreate: LiveEvent = {
    location: mediaAccount.location,
    description: 'Sample Live Event from Node.js SDK sample',
    // Set useStaticHostname to true to make the ingest and preview URL host name the same.
    // This can slow things down a bit.
    useStaticHostname: true,
    //hostnamePrefix: "somethingstatic", /// When using Static host name true, you can control the host prefix name here if desired
    // 1) Set up the input settings for the Live event...
    input: {
      streamingProtocol: KnownLiveEventInputProtocol.Rtmp, // options are RTMP or Smooth Streaming ingest format.
      accessControl: liveEventInputAccess, // controls the IP restriction for the source encoder.
      // keyFrameIntervalDuration: "PT2S",  // Set this to match the ingest encoder's settings. This should not be used for encoding live events
      accessToken: '9eb1f703b149417c8448771867f48501' // Use this value when you want to make sure the ingest URL is static and always the same. If omitted, the service will generate a random GUID value.
    },

    // 2) Set the live event to use pass-through or cloud encoding modes...
    encoding: {
      // Set this to Basic pass-through, Standard pass-through, Standard or Premium1080P to use the cloud live encoder.
      // See https://go.microsoft.com/fwlink/?linkid=2095101 for more information
      // Otherwise, leave as "None" to use pass-through mode
      encodingType: KnownLiveEventEncodingType.PassthroughStandard
      // OPTIONS for encoding type you can use:
      // encodingType: KnownLiveEventEncodingType.PassthroughBasic, // Basic pass-through mode - the cheapest option!
      // encodingType: KnownLiveEventEncodingType.PassthroughStandard, // also known as standard pass-through mode (formerly "none")
      // encodingType: KnownLiveEventEncodingType.Premium1080p,// live transcoding up to 1080P 30fps with adaptive bitrate set
      // encodingType: KnownLiveEventEncodingType.Standard,// use live transcoding in the cloud for 720P 30fps with adaptive bitrate set
      //
      // OPTIONS using live cloud encoding type:
      // keyFrameInterval: "PT2S", //If this value is not set for an encoding live event, the fragment duration defaults to 2 seconds. The value cannot be set for pass-through live events.
      // presetName: null, // only used for custom defined presets.
      //stretchMode: KnownStretchMode.None // can be used to determine stretch on encoder mode
    },
    // 3) Set up the Preview endpoint for monitoring based on the settings above we already set.
    preview: liveEventPreview,

    // 4) Set up more advanced options on the live event. Low Latency is the most common one.
    streamOptions: ['LowLatency']

    // 5) Optionally enable live transcriptions if desired.
    // WARNING : This is extra cost ($$$), so please check pricing before enabling. Transcriptions are not supported on PassthroughBasic.
    //           switch this sample to use encodingType: "PassthroughStandard" first before un-commenting the transcriptions object below.

    /* transcriptions : [
        {
            inputTrackSelection: [], // chose which track to transcribe on the source input.
            // The value should be in BCP-47 format (e.g: 'en-US'). See https://go.microsoft.com/fwlink/?linkid=2133742
            language: "en-us", 
            outputTranscriptionTrack: {
                trackName : "English" // set the name you want to appear in the output manifest
            }
        }
    ]
    */
  };

  console.log(
    'Creating the LiveEvent, please be patient as this can take time to complete async.'
  );
  console.log(
    'Live Event creation is an async operation in Azure and timing can depend on resources available.'
  );
  console.log();

  let timeStart = process.hrtime();
  // When autostart is set to true, the Live Event will be started after creation.
  // That means, the billing starts as soon as the Live Event starts running.
  // You must explicitly call Stop on the Live Event resource to halt further billing.
  // The following operation can sometimes take awhile. Be patient.
  // On optional workflow is to first call allocate() instead of create.
  // https://docs.microsoft.com/en-us/rest/api/media/liveevents/allocate
  // This allows you to allocate the resources and place the live event into a "Standby" mode until
  // you are ready to transition to "Running". This is useful when you want to pool resources in a warm "Standby" state at a reduced cost.
  // The transition from Standby to "Running" is much faster than cold creation to "Running" using the autostart property.
  // Returns a long running operation polling object that can be used to poll until completion.
  await mediaServicesClient.liveEvents
    .beginCreateAndWait(
      resourceGroup,
      accountName,
      liveEventName,
      liveEventCreate,
      // When autostart is set to true, you should "await" this method operation to complete.
      // The Live Event will be started after creation.
      // You may choose not to do this, but create the object, and then start it using the standby state to
      // keep the resources "warm" and billing at a lower cost until you are ready to go live.
      // That increases the speed of startup when you are ready to go live.
      {
        autoStart: false,
        updateIntervalInMs: longRunningOperationUpdateIntervalMs // This sets the polling interval for the long running ARM operation (LRO)
      }
    )
    .then((liveEvent) => {
      let timeEnd = process.hrtime(timeStart);
      console.info(
        `Live Event Created - long running operation complete! Name: ${liveEvent.name}`
      );
      console.info(
        `Execution time for create LiveEvent: %ds %dms`,
        timeEnd[0],
        timeEnd[1] / 1000000
      );
      console.log();
    })
    .catch((reason) => {
      if (reason.error && reason.error.message) {
        console.info(`Live Event creation failed: ${reason.message}`);
      }
    });
};
