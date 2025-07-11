export const checkWebp = () => {
    if (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0) {
        document.documentElement.classList.add('-webp');
    }
}
