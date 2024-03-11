<script setup lang="ts">
import { watch } from "vue";
import { onUnmounted } from "vue";
import { ref, onMounted, toRefs } from "vue";

const props = defineProps<{
  deviceWidth: number;
  deviceHeight: number;
}>();

const { deviceWidth, deviceHeight } = toRefs(props);

const emit = defineEmits<{
  (e: "update", image: Blob): void;
}>();

// Move the camera permissions into a `useHook`
const cameraPermissionGranted = ref<string | null | boolean>(null);
const cameras = ref<Record<string, any>[]>([]);
const selectedCamera = ref<string | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const mediaStream = ref<MediaStream | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const savedImageBlob = ref<Blob>();

const currentViewTab = ref<string>("live_view");

const checkCameraPermission = async () => {
  try {
    const permissionStatus = await navigator.permissions.query({
      name: "camera",
    });
    cameraPermissionGranted.value = permissionStatus.state;
  } catch (error) {
    console.error("Error checking camera permission:", error);
  }
};

const enumerateDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    cameras.value = devices
      .filter((device) => device.kind === "videoinput")
      .map((device) => ({
        value: device.deviceId,
        text: device.label,
      }));
  } catch (error) {
    console.error("Error enumerating video devices:", error);
  }
};

const requestCameraPermission = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({
      video: { width: deviceWidth.value, height: deviceHeight.value },
      audio: false,
    });
    cameraPermissionGranted.value = true;
    await enumerateDevices();
  } catch (error) {
    console.error("Error requesting camera access:", error);
  }
};

const startStream = async (item: string) => {
  if (!videoElement.value) return;
  selectedCamera.value = item;

  if (item === null) {
    stopVideoStream();
    localStorage.removeItem("directus-veryphatic-camera-capture");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: selectedCamera.value,
        width: deviceWidth.value,
        height: deviceHeight.value,
      },
    });
    mediaStream.value = stream;
    videoElement.value.srcObject = stream;
    videoElement.value.play();

    // save the camera for reuse
    localStorage.setItem("directus-veryphatic-web-cam", selectedCamera.value);
  } catch (error) {
    console.error("Error changing camera:", error);
  }
};

const stopVideoStream = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }
};

const takePhoto = () => {
  const video = videoElement.value as HTMLVideoElement;
  const canvas = canvasElement.value as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  canvas.width = deviceWidth.value;
  canvas.height = deviceHeight.value;

  context.drawImage(video, 0, 0, deviceWidth.value, deviceHeight.value);

  canvas.toBlob(
    (imageBlob) => {
      if (!imageBlob) return;
      savedImageBlob.value = imageBlob;
      currentViewTab.value = "captured_image_view";
    },
    "image/jpeg",
    1,
  );
};

watch(savedImageBlob, (newValue) => {
  if (newValue) sendUpdates();
});

const sendUpdates = () => {
  emit("update", savedImageBlob.value as Blob);
};

const retakePhoto = () => {
  currentViewTab.value = "live_view";
};

onMounted(async () => {
  await checkCameraPermission();
  if (cameraPermissionGranted.value) {
    await enumerateDevices();
    const savedCamera =
      localStorage.getItem("directus-veryphatic-camera-capture") ?? null;
    if (savedCamera) {
      startStream(savedCamera);
    }
  } else {
    await requestCameraPermission();
    await enumerateDevices();
  }
});

onUnmounted(async () => {
  await stopVideoStream();
});
</script>

<template>
  <div class="webcam-live-container">
    <!-- No permission -->
    <template v-if="cameraPermissionGranted === 'prompt'">
      <v-notice type="info">
        <p>
          Please grant your browser permission to use the USB camera by clicking
          the 'Request Camera Permission' button and allowing access when
          prompted.
        </p>
      </v-notice>

      <v-button @click="requestCameraPermission" :style="{ marginTop: '1rem' }"
        >Request camera permission
      </v-button>
    </template>

    <!-- Blocked -->
    <template v-else-if="cameraPermissionGranted === 'denied'">
      <v-notice type="warning">
        <div>
          <p>
            Your browser has blocked the USB/web camera from accessing it. To
            resolve this issue, please follow the instructions below to reset
            camera permissions in your specific browser
          </p>
          <p :style="{ marginTop: '1rem' }">
            To learn more about managing camera permissions and for instructions
            on resetting camera permissions in your specific browser, please see
            the following links:
          </p>
          <ul>
            <li>
              <a href="https://support.google.com/chrome/answer/2693767"
                >Google chrome</a
              >
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions#w_use-firefoxs-address-bar-to-clear-camera-or-microphone-permissions-for-a-site"
              >
                Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/en-au/guide/mac-help/mchlf6d108da/mac"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/change-camera-and-microphone-settings-in-microsoft-edge-00cf396f-13d8-4e78-9cc5-ea7c50d0798cc"
              >
                Edge
              </a>
            </li>
          </ul>
        </div>
      </v-notice>
    </template>

    <!-- Camera and listing -->
    <template v-else>
      <div :style="{ width: '100%' }">
        <div>
          <div class="webcam-select-camera">
            <label for="cameraSelect">Selected camera</label>
            <v-select
              v-model="selectedCamera"
              @update:modelValue="startStream"
              :items="cameras"
              placeholder="Please select a camera to use"
              show-deselect
            />

            <v-notice
              type="info"
              v-if="!selectedCamera"
              style="margin-top: 1rem"
            >
              <p>Please select a camera from the list above.</p>
            </v-notice>
          </div>

          <!-- Live video -->
          <div v-show="selectedCamera">
            <!-- Live image view -->
            <div v-show="currentViewTab === 'live_view'">
              <div v-if="!mediaStream" style="{ marginTop: '1rem' }">
                <v-info icon="camera" title="Preparing camera" type="info" />
              </div>
              <div v-show="mediaStream">
                <video
                  class="webcam-live-video"
                  ref="videoElement"
                  autoplay
                ></video>
              </div>
              <div
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                }"
              >
                <v-button @click="takePhoto">Take Photo</v-button>
                <v-chip large class="liveChip">Live Video</v-chip>
              </div>
            </div>

            <!-- Captured image view -->
            <div v-show="currentViewTab === 'captured_image_view'">
              <canvas
                ref="canvasElement"
                :style="{ width: '100%', height: 'auto' }"
              ></canvas>
              <div
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                }"
              >
                <v-button @click="retakePhoto" secondary>
                  Retake Photo
                </v-button>
                <v-chip large class="capturedChip">Captured Image</v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.liveChip {
  background-color: var(--danger);
  color: var(--foreground-inverted);
  margin: 0.5rem 0;
}

.capturedChip {
  background-color: var(--success);
  color: var(--background-inverted);
  margin: 0.5rem 0;
}

.webcam-live-container {
  width: 100%;
  padding: 16px;
}

.webcam-select-camera {
  margin-bottom: 16px;
}

.webcam-live-video {
  width: 100%;
  height: auto;
}
</style>
