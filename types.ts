// FIX: The `import React from 'react'` is essential. This file is a module (due
// to its `export` statements) and uses types from the 'react' package. Without
// this import, the `React` namespace is not resolved, causing the `declare global`
// block for JSX to fail. This failure is the root cause of the widespread
// "Property 'div' does not exist" errors throughout the application.
import React from 'react';

// FIX: Removed the problematic triple-slash directive for React types.
// This directive can conflict with the project's tsconfig.json settings,
// preventing global type augmentations (like the one for 'model-viewer'
// below) from being applied correctly across the project.
export type Category = 'Decor' | 'Crochet' | 'Random';

export interface CraftItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  // FIX: Added the optional `modelUrl` property to support 3D model viewing.
  // This resolves the "Property 'modelUrl' does not exist on type 'CraftItem'"
  // error in the ThreeDViewModal component, which relies on this property.
  modelUrl?: string;
}

export type View = 'catalog' | 'cart' | 'wishlist';

// FIX: Added global JSX namespace augmentation for the `<model-viewer>`
// custom element. This provides TypeScript with the necessary type information
// to recognize the element and its properties (like `src`, `autoRotate`, etc.),
// resolving the "Property 'model-viewer' does not exist" error.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        alt?: string;
        ar?: boolean;
        arModes?: string;
        cameraControls?: boolean;
        autoRotate?: boolean;
        shadowIntensity?: string | number;
      };
    }
  }
}
