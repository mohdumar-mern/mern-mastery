export const disableShortcuts = () => {
  document.addEventListener('contextmenu', event => event.preventDefault());
  document.addEventListener('keydown', event => {
    if (
      (event.ctrlKey && event.shiftKey && event.key === 'I') ||
      (event.ctrlKey && event.shiftKey && event.key === 'J') ||
      (event.key === 'F12')
    ) {
      event.preventDefault();
      alert('Developer tools are disabled for security.');
    }
  });
};

export const addWatermark = (userId) => {
  const watermark = document.createElement('div');
  watermark.style.position = 'fixed';
  watermark.style.top = '10px';
  watermark.style.right = '10px';
  watermark.style.opacity = '0.5';
  watermark.textContent = `User: ${userId} | ${new Date().toLocaleString()}`;
  document.body.appendChild(watermark);
};