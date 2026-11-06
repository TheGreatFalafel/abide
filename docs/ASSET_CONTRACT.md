# Ari 3D Asset Contract

The starter code expects a rigged glTF binary at:

`public/characters/ari/ari.glb`

## Required model properties

- One complete, skinned full-body lion mesh (or a small optimized set of meshes).
- A usable skeleton with deformation weights.
- Consistent forward-facing orientation: character looks toward local `+Z` or adjust the component camera/model rotation to match the exported asset.
- Character feet near the model origin; adjust the group Y offset in `Ari3D.tsx` after inspecting the model.
- PBR materials with embedded or correctly referenced textures.
- No external network dependencies.
- Prefer 30–60k triangles for a mobile-friendly hero character; optimize textures and geometry based on visual quality.
- Export animations in the same GLB file.

## Animation clip names

The default names expected by the component are:

`Idle`, `Greet`, `Walk`, `Run`, `Think`, `Guide`, `Correct`, `Encourage`, `Celebrate`, `Jump`, `LevelUp`, `Milestone`.

Clip names can be mapped with the `animationMap` prop if the Blender/export pipeline uses different names.

## Animation behavior

- `Idle`, `Walk`, and `Run` loop.
- Other clips play once and hold their final pose until another state is selected.
- The component cross-fades between clips.
- Reduced-motion preference forces the idle clip.

## Art direction from the supplied reference

Target a warm, premium, stylized 3D animated-film aesthetic:
- Golden/tawny lion body.
- Rich layered brown mane with sculpted clumps, not individual high-cost fur strands.
- Large expressive eyes and readable eyebrows.
- Soft rounded muzzle and friendly smile.
- Rounded paws and believable anatomy.
- Warm studio lighting, soft shadows, and gentle material roughness.
- Keep the silhouette readable at small mobile sizes.

The supplied reference image is a style guide, not a production-ready 3D model. It does not contain a rig, mesh, skeleton, or animation data.
