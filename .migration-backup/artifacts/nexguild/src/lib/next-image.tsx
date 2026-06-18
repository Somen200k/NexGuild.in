interface NextImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  style?: React.CSSProperties;
  sizes?: string;
  quality?: number;
  [key: string]: unknown;
}

const Image = ({ src, alt, width, height, className, fill, priority: _priority, sizes: _sizes, quality: _quality, ...rest }: NextImageProps) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } : undefined}
    {...rest}
  />
);

export default Image;
