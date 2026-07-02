import { GalaxyMaterial } from "../galaxy/GalaxyMaterial";

export function RedMaterial(props: JSX.IntrinsicElements["meshPhysicalMaterial"]) {
  return (
    <GalaxyMaterial
      color="#ff2d2d"
      emissive="#4a0d0d"
      emissiveIntensity={0.5}
      roughness={0.25}
      metalness={0.6}
      clearcoat={0.6}
      clearcoatRoughness={0.2}
      {...props}
    />
  );
}
