import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import * as readlineSync from 'readline-sync';
import { DefaultAzureCredential } from '@azure/identity';
import {
  AzureMediaServices,
  IPRange,
  LiveEvent,
  LiveEventInputAccessControl,
  LiveEventPreview,
  LiveOutput,
  MediaservicesGetResponse,
  ErrorResponse,
  KnownLiveEventEncodingType,
  KnownLiveEventInputProtocol
} from '@azure/arm-mediaservices';
import moment from 'moment';

dotenv.config();

let mediaServicesClient: AzureMediaServices;

const longRunningOperationUpdateIntervalMs = 2000;

const subscriptionId: string = process.env.AZURE_SUBSCRIPTION_ID as string;
const resourceGroup: string = process.env.AZURE_RESOURCE_GROUP as string;
const accountName: string = process.env
  .AZURE_MEDIA_SERVICES_ACCOUNT_NAME as string;

// const credential = new ManagedIdentityCredential("<USER_ASSIGNED_MANAGED_IDENTITY_CLIENT_ID>");
const credential = new DefaultAzureCredential();

//////////////////////////////////////////
//   Main entry point for sample script  //
///////////////////////////////////////////
export async function rtmp() {
  let uniqueness = uuidv4().split('-')[0]; // Create a GUID for uniqueness
  let liveEventName = `liveEvent-${uniqueness}`; // WARNING: Be careful not to leak live events using this sample!
  let assetName = `archiveAsset${uniqueness}`;
  let liveOutputName = `liveOutput${uniqueness}`;
  let streamingLocatorName = `liveStreamLocator${uniqueness}`;
  let streamingEndpointName = 'default'; // Change this to your specific streaming endpoint name if not using "default"
  let mediaAccount: MediaservicesGetResponse;

  let liveEvent: LiveEvent;
  let liveOutput: LiveOutput;

  console.log('Starting the Live Streaming sample for Azure Media Services');
  try {
    mediaServicesClient = new AzureMediaServices(credential, subscriptionId);
  } catch (err) {
    console.log(`Error retrieving Media Services Client.`);
  }

  // Get the media services account object for information on the current location.
  mediaAccount = await mediaServicesClient.mediaservices.get(
    resourceGroup,
    accountName
  );

  // </CreateMediaServicesClient>

  try {
    let allowAllIPv4InputRange: IPRange = {
      name: 'Allow all IPv4 addresses',
      address: '0.0.0.0',
      subnetPrefixLength: 0
    };

    let allowAllIPv6InputRange: IPRange = {
      name: 'Allow all IPv6 addresses',
      address: '::',
      subnetPrefixLength: 0
    };

    let liveEventInputAccess: LiveEventInputAccessControl = {
      ip: {
        allow: [allowAllIPv4InputRange, allowAllIPv6InputRange]
      }
    };

    let liveEventPreview: LiveEventPreview = {
      accessControl: {
        ip: {
          allow: [allowAllIPv4InputRange, allowAllIPv6InputRange]
        }
      }
    };

    let liveEventCreate: LiveEvent = {
      location: mediaAccount.location,
      description: 'Sample Live Event from Node.js SDK sample',
      useStaticHostname: true,

      input: {
        streamingProtocol: KnownLiveEventInputProtocol.Rtmp, // options are RTMP or Smooth Streaming ingest format.
        accessControl: liveEventInputAccess // controls the IP restriction for the source encoder.
        // keyFrameIntervalDuration: "PT2S",  // Set this to match the ingest encoder's settings. This should not be used for encoding live events
        // @TODO accessToken: '9eb1f703b149417c8448771867f48501' // Use this value when you want to make sure the ingest URL is static and always the same. If omitted, the service will generate a random GUID value.
      },

      encoding: {
        encodingType: KnownLiveEventEncodingType.PassthroughStandard
      },
      preview: liveEventPreview,

      streamOptions: ['LowLatency']
    };

    console.log(
      'Creating the LiveEvent, please be patient as this can take time to complete async.'
    );
    console.log(
      'Live Event creation is an async operation in Azure and timing can depend on resources available.'
    );
    console.log();

    let timeStart = process.hrtime();
    await mediaServicesClient.liveEvents
      .beginCreateAndWait(
        resourceGroup,
        accountName,
        liveEventName,
        liveEventCreate,
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

    console.log(`Creating an asset named: ${assetName}`);
    console.log();
    let asset = await mediaServicesClient.assets.createOrUpdate(
      resourceGroup,
      accountName,
      assetName,
      {}
    );

    let manifestName: string = 'output';
    console.log(`Creating a live output named: ${liveOutputName}`);
    console.log();

    timeStart = process.hrtime();

    // <CreateLiveOutput>
    let liveOutputCreate: LiveOutput;
    if (asset.name) {
      liveOutputCreate = {
        description:
          'Optional description when using more than one live output',
        assetName: asset.name,
        manifestName: manifestName, // The HLS and DASH manifest file name. This is recommended to set if you want a deterministic manifest path up front.
        archiveWindowLength: 'PT30M', // sets the asset archive window to 30 minutes. Uses ISO 8601 format string.
        rewindWindowLength: 'PT30M', // sets the time-shit(DVR) window to 30 minutes. Uses ISO 8601 format string.
        hls: {
          fragmentsPerTsSegment: 1 // Advanced setting when using HLS TS output only.
        }
      };

      // Create and await the live output
      await mediaServicesClient.liveOutputs
        .beginCreateAndWait(
          resourceGroup,
          accountName,
          liveEventName,
          liveOutputName,
          liveOutputCreate,
          {
            updateIntervalInMs: longRunningOperationUpdateIntervalMs // Setting this adjusts the polling interval of the long running operation.
          }
        )
        .then((liveOutput) => {
          console.log(`Live Output Created: ${liveOutput.name}`);
          let timeEnd = process.hrtime(timeStart);
          console.info(
            `Execution time for create Live Output: %ds %dms`,
            timeEnd[0],
            timeEnd[1] / 1000000
          );
          console.log();
        })
        .catch((reason) => {
          if (reason.error && reason.error.message) {
            console.info(`Live Output creation failed: ${reason.message}`);
          }
        });
    }
    if (liveEventCreate.input != null) {
      liveEventCreate.input.accessToken =
        '8257f1d1-8247-4318-b743-f541c20ea7a6';
      liveEventCreate.hostnamePrefix = `${liveEventName}-updated`;
      // Calling update
      await mediaServicesClient.liveEvents
        .beginUpdateAndWait(
          resourceGroup,
          accountName,
          liveEventName,
          liveEventCreate
        )
        .then((liveEvent) => {
          // The liveEvent returned here contains all of the updated properties you made above, and you can use the details in here to log or adjust your code.
          console.log(
            `Updated the Live Event accessToken for live event named: ${liveEvent.name}`
          );
        })
        .catch((reason) => {
          // Check for ErrorResponse object
          if (reason.error && reason.error.message) {
            console.info(`Live Event Update failed: ${reason.message}`);
          }
        });
    }

    console.log(`Starting the Live Event operation... please stand by`);
    timeStart = process.hrtime();
    // Start the Live Event - this will take some time...
    console.log(
      `The Live Event is being allocated. If the service's hot pool is completely depleted in a region, this could delay here for up to 15-20 minutes while machines are allocated.`
    );
    console.log(
      `If this is taking a very long time, wait for at least 20 minutes and check on the status. If the code times out, or is cancelled, be sure to clean up in the portal!`
    );

    await mediaServicesClient.liveEvents
      .beginStartAndWait(resourceGroup, accountName, liveEventName, {
        updateIntervalInMs: longRunningOperationUpdateIntervalMs // Setting this adjusts the polling interval of the long running operation.
      })
      .then(() => {
        console.log(`Live Event Started`);
        let timeEnd = process.hrtime(timeStart);
        console.info(
          `Execution time for start Live Event: %ds %dms`,
          timeEnd[0],
          timeEnd[1] / 1000000
        );
        console.log();
      });

    let liveEvent = await mediaServicesClient.liveEvents.get(
      resourceGroup,
      accountName,
      liveEventName
    );

    liveEvent.tags = {
      startTime: moment().format()
    };

    await mediaServicesClient.liveEvents.beginUpdateAndWait(
      resourceGroup,
      accountName,
      liveEventName,
      liveEvent,
      { updateIntervalInMs: longRunningOperationUpdateIntervalMs }
    );

    if (liveEvent.input?.endpoints) {
      let ingestUrl = liveEvent.input.endpoints[0].url;
      console.log(`The RTMP ingest URL to enter into OBS Studio is:`);
      console.log(`RTMP ingest : ${ingestUrl}`);
      console.log(
        `Make sure to enter a Stream Key into the OBS studio settings. It can be any value or you can repeat the accessToken used in the ingest URL path.`
      );
      console.log();
    }

    if (liveEvent.preview?.endpoints) {
      let previewEndpoint = liveEvent.preview.endpoints[0].url;
      console.log('The preview url is:');
      console.log(previewEndpoint);
      console.log();
      console.log(
        'Open the live preview in your browser and use any DASH or HLS player to monitor the preview playback:'
      );
      console.log(
        `https://ampdemo.azureedge.net/?url=${previewEndpoint}(format=mpd-time-cmaf)&heuristicprofile=lowlatency`
      );
      console.log(
        'You will need to refresh the player page SEVERAL times until enough data has arrived to allow for manifest creation.'
      );
      console.log(
        'In a production player, the player can inspect the manifest to see if it contains enough content for the player to load and auto reload.'
      );
      console.log();
    }

    console.log(
      'Start the live stream now, sending the input to the ingest url and verify that it is arriving with the preview url.'
    );
    console.log(
      'IMPORTANT TIP!: Make CERTAIN that the video is flowing to the Preview URL before continuing!'
    );

    console.log(
      'PAUSE here in the Debugger until you are ready to continue...'
    );
    if (readlineSync.keyInYN('Do you want to continue?')) {
      //Yes
    } else {
      throw new Error('User canceled. Cleaning up...');
    }

    // Create the Streaming Locator URL for playback of the contents in the Live Output recording
    console.log(`Creating a streaming locator named : ${streamingLocatorName}`);
    console.log();
    let locator = await createStreamingLocator(assetName, streamingLocatorName);

    // Get the default streaming endpoint on the account
    let streamingEndpoint = await mediaServicesClient.streamingEndpoints.get(
      resourceGroup,
      accountName,
      streamingEndpointName
    );

    if (streamingEndpoint?.resourceState !== 'Running') {
      console.log(
        `Streaming endpoint is stopped. Starting the endpoint named ${streamingEndpointName}`
      );
      await mediaServicesClient.streamingEndpoints
        .beginStartAndWait(resourceGroup, accountName, streamingEndpointName, {
          updateIntervalInMs: longRunningOperationUpdateIntervalMs // Setting this adjusts the polling interval of the long running operation.
        })
        .then(() => {
          console.log('Streaming Endpoint Started.');
        });
    }

    // Get the url to stream the output
    console.log(
      'The streaming URLs to stream the live output from a client player'
    );
    console.log();

    let hostname = streamingEndpoint.hostName;
    let scheme = 'https';

    await buildManifestPaths(
      scheme,
      hostname,
      locator.streamingLocatorId,
      manifestName
    );

    // SET A BREAKPOINT HERE!
    console.log(
      'PAUSE here in the Debugger until you are ready to continue...'
    );
    if (
      readlineSync.keyInYN('Do you want to continue and clean up the sample?')
    ) {
      //Yes
    }
  } catch (err) {
    console.log(err);
    console.error(
      'WARNING: If you hit this message, double check the Portal to make sure you do not have any Running live events after using this Sample- or they will remain billing!'
    );
  } finally {
    // Cleaning Up all resources
    //@ts-ignore - these will be set, so avoiding the compiler complaint for now.
    console.log(
      'Cleaning up resources, stopping Live Event billing, and deleting live Event...'
    );
    console.log(
      "CRITICAL WARNING ($$$$) DON'T WASTE MONEY!: - Wait here for the All Clear - this takes a few minutes sometimes to clean up. DO NOT STOP DEBUGGER yet or you will leak billable resources!"
    );
    await cleanUpResources(liveEventName, liveOutputName);
    console.log(
      'All Clear, and all cleaned up. Please double check in the portal to make sure you have not leaked any Live Events, or left any Running still which would result in unwanted billing.'
    );
  }
}

rtmp().catch((err) => {
  console.error('Error running live streaming sample:', err.message);

  if (err.name == 'RestError') {
    // REST API Error message
    console.error('Error request:\n\n', err.request);
  }

  console.error(
    'WARNING: If you hit this message, double check the Portal to make sure you do not have any Running live events - or they will remain billing!'
  );
});

// <BuildManifestPaths>

// This method builds the manifest URL from the static values used during creation of the Live Output.
// This allows you to have a deterministic manifest path. <streaming endpoint hostname>/<streaming locator ID>/manifestName.ism/manifest(<format string>)
// マニフェストパスの取得
export async function buildManifestPaths(
  scheme: string,
  hostname: string | undefined,
  streamingLocatorId: string | undefined,
  manifestName: string
) {
  const hlsFormat: string = 'format=m3u8-cmaf';
  const dashFormat: string = 'format=mpd-time-cmaf';

  let manifestBase = `${scheme}://${hostname}/${streamingLocatorId}/${manifestName}.ism/manifest`;
  let hlsManifest = `${manifestBase}(${hlsFormat})`;
  console.log(`The HLS (MP4) manifest URL is : ${hlsManifest}`);
  console.log(
    'Open the following URL to playback the live stream in an HLS compliant player (HLS.js, Shaka, ExoPlayer) or directly in an iOS device'
  );
  console.log(`${hlsManifest}`);
  console.log();

  let dashManifest = `${manifestBase}(${dashFormat})`;
  console.log(`The DASH manifest URL is : ${dashManifest}`);
  console.log(
    'Open the following URL to playback the live stream from the LiveOutput in the Azure Media Player'
  );
  console.log(
    `https://ampdemo.azureedge.net/?url=${dashManifest}&heuristicprofile=lowlatency`
  );
  console.log();
  return `https://ampdemo.azureedge.net/?url=${dashManifest}&heuristicprofile=lowlatency`;
}

// </BuildManifestPaths>

// This method demonstrates using the listPaths method on Streaming locators to print out the DASH and HLS manifest links
// Optionally you can just build the paths if you are setting the manifest name and would like to create the streaming
// manifest URls before you actually start streaming.
// The paths in the function listPaths on streaming locators are not available until streaming has actually started.
// Keep in mind that this workflow is not great when you need to have the manifest URL up front for a CMS.
// It is just provided here for example of listing all the dynamic format paths available at runtime of the live event.
// HLSマニフェストの取得
export async function listStreamingPaths(
  streamingLocatorName: string,
  scheme: string,
  hostname: string
) {
  let streamingPaths = await mediaServicesClient.streamingLocators.listPaths(
    resourceGroup,
    accountName,
    streamingLocatorName
  );

  let hlsManifest: string;
  let dashManifest: string;

  // TODO : rewrite this to be more deterministic.
  if (
    streamingPaths.streamingPaths &&
    streamingPaths.streamingPaths.length > 0
  ) {
    streamingPaths.streamingPaths.forEach((path) => {
      if (path.streamingProtocol == 'Hls') {
        if (path.paths) {
          path.paths.forEach((hlsFormat) => {
            // Look for the CMAF HLS format URL. This is the most current HLS version supported
            if (hlsFormat.indexOf('m3u8-cmaf') > 0) {
              hlsManifest = `${scheme}://${hostname}${hlsFormat}`;
              console.log(`The HLS (MP4) manifest URL is : ${hlsManifest}`);
              console.log(
                'Open the following URL to playback the live stream in an HLS compliant player (HLS.js, Shaka, ExoPlayer) or directly in an iOS device'
              );
              console.log(`${hlsManifest}`);
              console.log();
              return hlsManifest;
            }
          });
        }
      }
      if (path.streamingProtocol == 'Dash') {
        if (path.paths) {
          path.paths.forEach((dashFormat) => {
            // Look for the CMAF DASH format URL. This is the most current DASH version supported
            if (dashFormat.indexOf('cmaf') > 0) {
              dashManifest = `${scheme}://${hostname}${dashFormat}`;
              console.log(`The DASH manifest URL is : ${dashManifest}`);

              console.log(
                'Open the following URL to playback the live stream from the LiveOutput in the Azure Media Player'
              );
              console.log(
                `https://ampdemo.azureedge.net/?url=${dashManifest}&heuristicprofile=lowlatency"`
              );
              console.log();
            }
          });
        }
      }
    });
  } else {
    console.error(
      'No streaming paths found. Make sure that the encoder is sending data to the ingest point.'
    );
  }
  return '';
}

// <CreateStreamingLocator>
export async function createStreamingLocator(
  assetName: string,
  locatorName: string
) {
  let streamingLocator = {
    assetName: assetName,
    streamingPolicyName: 'Predefined_ClearStreamingOnly' // no DRM or AES128 encryption protection on this asset. Clear means un-encrypted.
  };

  let locator = await mediaServicesClient.streamingLocators.create(
    resourceGroup,
    accountName,
    locatorName,
    streamingLocator
  );

  return locator;
}
// </CreateStreamingLocator>

// <CleanUpResources>
// Stops and cleans up all resources used in the sample
// Be sure to double check the portal to make sure you do not have any accidentally leaking resources that are in billable states.
// リソースを停止してクリーンアップ
export async function cleanUpResources(
  liveEventName: string,
  liveOutputName: string
) {
  let liveOutputForCleanup = await mediaServicesClient.liveOutputs.get(
    resourceGroup,
    accountName,
    liveEventName,
    liveOutputName
  );

  // First clean up and stop all live outputs - "recordings"
  // This will NOT delete the archive asset. It just stops the tape recording machine.
  // All tapes (asset objects) are retained in your storage account and can continue to be streamed
  // as on-demand content without any changes.

  console.log('Deleting Live Output');
  let timeStart = process.hrtime();
  // Wait for this to cleanup first and then continue...
  if (liveOutputForCleanup) {
    await mediaServicesClient.liveOutputs
      .beginDeleteAndWait(
        resourceGroup,
        accountName,
        liveEventName,
        liveOutputName,
        {
          updateIntervalInMs: longRunningOperationUpdateIntervalMs // Setting this adjusts the polling interval of the long running operation.
        }
      )
      .then(() => {
        let timeEnd = process.hrtime(timeStart);
        console.info(
          `Execution time for delete live output: %ds %dms`,
          timeEnd[0],
          timeEnd[1] / 1000000
        );
        console.log();
      });
  }

  // OPTIONAL - If you want to immediately use the Asset for encoding, analysis, or other workflows, you can do so here.
  // This is the point at which you can immediately use the archived, recorded asset in storage for other tasks.
  // You do not need to wait for the live event to clean up before continuing with other tasks on the recorded output.

  // Once the above completes, you can refresh the player to see that the live stream has stopped and you are now viewing the recorded asset in on-demand mode.

  // Next we will clean up the live event by stopping it and then deleting it.
  // Stop can take some time, as it has to clean up resources async.

  let liveEventForCleanup = await mediaServicesClient.liveEvents.get(
    resourceGroup,
    accountName,
    liveEventName
  );

  console.log('Stopping Live Event...');
  if (liveEventForCleanup) {
    timeStart = process.hrtime();
    if (liveEventForCleanup.resourceState == 'Running') {
      await mediaServicesClient.liveEvents
        .beginStopAndWait(
          resourceGroup,
          accountName,
          liveEventName,
          {
            // It can be faster to delete all live outputs first, and then delete the live event.
            // if you have additional workflows on the archive to run. Speeds things up!
            //removeOutputsOnStop :true // this is OPTIONAL, but recommend deleting them manually first.
          },
          {
            updateIntervalInMs: longRunningOperationUpdateIntervalMs // Setting this adjusts the polling interval of the long running operation.
          }
        )
        .then(() => {
          let timeEnd = process.hrtime(timeStart);
          console.info(
            `Execution time for Stop Live Event: %ds %dms`,
            timeEnd[0],
            timeEnd[1] / 1000000
          );
          console.log();
        });
    }

    timeStart = process.hrtime();
    // Delete the Live Event
    console.log('Deleting Live Event...');
    let deleteLiveEventOperation = await mediaServicesClient.liveEvents
      .beginDeleteAndWait(resourceGroup, accountName, liveEventName, {
        updateIntervalInMs: longRunningOperationUpdateIntervalMs // Setting this adjusts the polling interval of the long running operation.
      })
      .then(() => {
        let timeEnd = process.hrtime(timeStart);
        console.info(
          `Execution time for Delete Live Event: %ds %dms`,
          timeEnd[0],
          timeEnd[1] / 1000000
        );
        console.log();
      });

    // IMPORTANT! Open the portal again and make CERTAIN that the live event is stopped and deleted - and that you do not have any billing live events running still.
  }
  // </CleanUpResources>
}
