import { defineInterface } from '@directus/extensions-sdk';
import WebCamInterface from './components/WebCamInterface.vue';

export default defineInterface({
	id: 'veryphatic-webcam-interface',
	name: 'Webcam image capture',
	icon: 'camera',
	description: 'Capture images using the webcam',
	component: WebCamInterface,
	relational: true,
	types: ['alias'],
	localTypes: ['files'],
	group: 'relational',
	recommendedDisplays: ['related-values'],
	options: () => {
		return [
			{
				field: 'folder',
				name: '$t:interfaces.system-folder.folder',
				type: 'uuid',
				meta: {
					width: 'full',
					interface: 'system-folder',
					note: '$t:interfaces.system-folder.field_hint',
				},
			},
			{
				field: 'device_width',
				name: 'Camera dimension (width)',
				type: 'integer',
				meta: {
					interface: 'input',
					width: 'half'
				},
				schema: {
					default_value: 1920
				}
			},
			{
				field: 'device_height',
				name: 'Camera dimension (height)',
				type: 'integer',
				meta: {
					interface: 'input',
					width: 'half'
				},
				schema: {
					default_value: 1080
				}
			},
		]
	},
});
