import * as React from 'react';

export type Category = 'Decor' | 'Crochet' | 'Random';

export interface CraftItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  modelUrl?: string;
}

export type View = 'catalog' | 'cart' | 'wishlist';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Standard HTML elements
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      abbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      address: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      area: React.DetailedHTMLProps<React.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
      article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      audio: React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
      b: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      base: React.DetailedHTMLProps<React.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
      bdi: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      bdo: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      big: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      blockquote: React.DetailedHTMLProps<React.BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
      body: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
      br: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      canvas: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
      caption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      code: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      col: React.DetailedHTMLProps<React.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
      colgroup: React.DetailedHTMLProps<React.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
      data: React.DetailedHTMLProps<React.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
      datalist: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
      dd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      del: React.DetailedHTMLProps<React.DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
      details: React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
      dfn: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      dialog: React.DetailedHTMLProps<React.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      dl: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
      dt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      em: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      embed: React.DetailedHTMLProps<React.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
      fieldset: React.DetailedHTMLProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
      figcaption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      figure: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      head: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
      header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      hgroup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      hr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
      html: React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
      i: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      iframe: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
      img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      ins: React.DetailedHTMLProps<React.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
      kbd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      keygen: React.DetailedHTMLProps<React.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
      label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      legend: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
      li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
      link: React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
      main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      map: React.DetailedHTMLProps<React.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
      mark: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      menu: React.DetailedHTMLProps<React.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
      menuitem: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      meta: React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
      meter: React.DetailedHTMLProps<React.MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
      nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      noscript: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      object: React.DetailedHTMLProps<React.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
      ol: React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
      optgroup: React.DetailedHTMLProps<React.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
      option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
      output: React.DetailedHTMLProps<React.OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      param: React.DetailedHTMLProps<React.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
      picture: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      pre: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
      progress: React.DetailedHTMLProps<React.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
      q: React.DetailedHTMLProps<React.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
      rp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      rt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      ruby: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      s: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      samp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      script: React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
      small: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      source: React.DetailedHTMLProps<React.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
      sub: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      summary: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      sup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
      tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
      textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
      tfoot: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      th: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
      thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      time: React.DetailedHTMLProps<React.TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
      title: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
      tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
      track: React.DetailedHTMLProps<React.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
      u: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      "var": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      video: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
      wbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

      // SVG elements
      svg: React.DetailedHTMLProps<React.SVGProps<SVGSVGElement>, SVGSVGElement>;
      animate: React.DetailedHTMLProps<React.SVGProps<SVGElement>, SVGElement>; // TODO: It is SVGAnimateElement but it is not in dom
      animateMotion: React.DetailedHTMLProps<React.SVGProps<SVGElement>, SVGElement>;
      animateTransform: React.DetailedHTMLProps<React.SVGProps<SVGElement>, SVGElement>; // TODO: It is SVGAnimateTransformElement but it is not in dom
      circle: React.DetailedHTMLProps<React.SVGProps<SVGCircleElement>, SVGCircleElement>;
      clipPath: React.DetailedHTMLProps<React.SVGProps<SVGClipPathElement>, SVGClipPathElement>;
      defs: React.DetailedHTMLProps<React.SVGProps<SVGDefsElement>, SVGDefsElement>;
      desc: React.DetailedHTMLProps<React.SVGProps<SVGDescElement>, SVGDescElement>;
      ellipse: React.DetailedHTMLProps<React.SVGProps<SVGEllipseElement>, SVGEllipseElement>;
      feBlend: React.DetailedHTMLProps<React.SVGProps<SVGFEBlendElement>, SVGFEBlendElement>;
      feColorMatrix: React.DetailedHTMLProps<React.SVGProps<SVGFEColorMatrixElement>, SVGFEColorMatrixElement>;
      feComponentTransfer: React.DetailedHTMLProps<React.SVGProps<SVGFEComponentTransferElement>, SVGFEComponentTransferElement>;
      feComposite: React.DetailedHTMLProps<React.SVGProps<SVGFECompositeElement>, SVGFECompositeElement>;
      feConvolveMatrix: React.DetailedHTMLProps<React.SVGProps<SVGFEConvolveMatrixElement>, SVGFEConvolveMatrixElement>;
      feDiffuseLighting: React.DetailedHTMLProps<React.SVGProps<SVGFEDiffuseLightingElement>, SVGFEDiffuseLightingElement>;
      feDisplacementMap: React.DetailedHTMLProps<React.SVGProps<SVGFEDisplacementMapElement>, SVGFEDisplacementMapElement>;
      feDistantLight: React.DetailedHTMLProps<React.SVGProps<SVGFEDistantLightElement>, SVGFEDistantLightElement>;
      feDropShadow: React.DetailedHTMLProps<React.SVGProps<SVGFEDropShadowElement>, SVGFEDropShadowElement>;
      feFlood: React.DetailedHTMLProps<React.SVGProps<SVGFEFloodElement>, SVGFEFloodElement>;
      feFuncA: React.DetailedHTMLProps<React.SVGProps<SVGFEFuncAElement>, SVGFEFuncAElement>;
      feFuncB: React.DetailedHTMLProps<React.SVGProps<SVGFEFuncBElement>, SVGFEFuncBElement>;
      feFuncG: React.DetailedHTMLProps<React.SVGProps<SVGFEFuncGElement>, SVGFEFuncGElement>;
      feFuncR: React.DetailedHTMLProps<React.SVGProps<SVGFEFuncRElement>, SVGFEFuncRElement>;
      feGaussianBlur: React.DetailedHTMLProps<React.SVGProps<SVGFEGaussianBlurElement>, SVGFEGaussianBlurElement>;
      feImage: React.DetailedHTMLProps<React.SVGProps<SVGFEImageElement>, SVGFEImageElement>;
      feMerge: React.DetailedHTMLProps<React.SVGProps<SVGFEMergeElement>, SVGFEMergeElement>;
      feMergeNode: React.DetailedHTMLProps<React.SVGProps<SVGFEMergeNodeElement>, SVGFEMergeNodeElement>;
      feMorphology: React.DetailedHTMLProps<React.SVGProps<SVGFEMorphologyElement>, SVGFEMorphologyElement>;
      feOffset: React.DetailedHTMLProps<React.SVGProps<SVGFEOffsetElement>, SVGFEOffsetElement>;
      fePointLight: React.DetailedHTMLProps<React.SVGProps<SVGFEPointLightElement>, SVGFEPointLightElement>;
      feSpecularLighting: React.DetailedHTMLProps<React.SVGProps<SVGFESpecularLightingElement>, SVGFESpecularLightingElement>;
      feSpotLight: React.DetailedHTMLProps<React.SVGProps<SVGFESpotLightElement>, SVGFESpotLightElement>;
      feTile: React.DetailedHTMLProps<React.SVGProps<SVGFETileElement>, SVGFETileElement>;
      feTurbulence: React.DetailedHTMLProps<React.SVGProps<SVGFETurbulenceElement>, SVGFETurbulenceElement>;
      filter: React.DetailedHTMLProps<React.SVGProps<SVGFilterElement>, SVGFilterElement>;
      foreignObject: React.DetailedHTMLProps<React.SVGProps<SVGForeignObjectElement>, SVGForeignObjectElement>;
      g: React.DetailedHTMLProps<React.SVGProps<SVGGElement>, SVGGElement>;
      image: React.DetailedHTMLProps<React.SVGProps<SVGImageElement>, SVGImageElement>;
      line: React.DetailedHTMLProps<React.SVGProps<SVGLineElement>, SVGLineElement>;
      linearGradient: React.DetailedHTMLProps<React.SVGProps<SVGLinearGradientElement>, SVGLinearGradientElement>;
      marker: React.DetailedHTMLProps<React.SVGProps<SVGMarkerElement>, SVGMarkerElement>;
      mask: React.DetailedHTMLProps<React.SVGProps<SVGMaskElement>, SVGMaskElement>;
      metadata: React.DetailedHTMLProps<React.SVGProps<SVGMetadataElement>, SVGMetadataElement>;
      mpath: React.DetailedHTMLProps<React.SVGProps<SVGElement>, SVGElement>;
      path: React.DetailedHTMLProps<React.SVGProps<SVGPathElement>, SVGPathElement>;
      pattern: React.DetailedHTMLProps<React.SVGProps<SVGPatternElement>, SVGPatternElement>;
      polygon: React.DetailedHTMLProps<React.SVGProps<SVGPolygonElement>, SVGPolygonElement>;
      polyline: React.DetailedHTMLProps<React.SVGProps<SVGPolylineElement>, SVGPolylineElement>;
      radialGradient: React.DetailedHTMLProps<React.SVGProps<SVGRadialGradientElement>, SVGRadialGradientElement>;
      rect: React.DetailedHTMLProps<React.SVGProps<SVGRectElement>, SVGRectElement>;
      stop: React.DetailedHTMLProps<React.SVGProps<SVGStopElement>, SVGStopElement>;
      switch: React.DetailedHTMLProps<React.SVGProps<SVGSwitchElement>, SVGSwitchElement>;
      symbol: React.DetailedHTMLProps<React.SVGProps<SVGSymbolElement>, SVGSymbolElement>;
      text: React.DetailedHTMLProps<React.SVGProps<SVGTextElement>, SVGTextElement>;
      textPath: React.DetailedHTMLProps<React.SVGProps<SVGTextPathElement>, SVGTextPathElement>;
      tspan: React.DetailedHTMLProps<React.SVGProps<SVGTSpanElement>, SVGTSpanElement>;
      use: React.DetailedHTMLProps<React.SVGProps<SVGUseElement>, SVGUseElement>;
      view: React.DetailedHTMLProps<React.SVGProps<SVGViewElement>, SVGViewElement>;

      // Custom element
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