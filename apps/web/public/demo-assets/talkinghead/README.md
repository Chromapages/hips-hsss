# TalkingHead Demo Assets

The 3D avatar mode currently uses two TalkingHead demo models:

`https://met4citizen.github.io/TalkingHead/avatars/brunette.glb`

`https://met4citizen.github.io/TalkingHead/avatars/avatarsdk.glb`

They are stored locally as `brunette.glb` (woman) and `avatarsdk-male.glb` (man). The TalkingHead repository presents these as example assets. They are acceptable for local/demo validation only. Do not enable either asset for production or paid/commercial use without completing a license review or replacing it with a reviewed production model.

The files under `male-textures/` are the male GLB's embedded base-color textures, extracted locally so the browser can recolor skin, hair, irises, and clothing without discarding the model's original shading and detail. They inherit the same demo-only licensing status as `avatarsdk-male.glb`.

For production, place a reviewed privacy-safe `.glb` avatar here and update `TALKING_HEAD_DEMO_ASSET_URL` in `src/components/session-ui/avatars/TalkingHeadAvatar.tsx` to a local `/demo-assets/talkinghead/...` path. The model must be compatible with TalkingHead: GLB format, Mixamo-compatible rig, and ARKit/Oculus viseme blend shapes if real lip-sync is added later.
