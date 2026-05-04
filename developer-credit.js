document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector('.developer-credit')) return;

    const style = document.createElement('style');
    style.innerHTML = `
      .developer-credit {
        position: fixed;
        bottom: 10px;
        right: 15px;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 13px;
        color: #aaa;
        background: rgba(0, 0, 0, 0.6);
        padding: 6px 12px;
        border-radius: 20px;
        backdrop-filter: blur(6px);
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
        z-index: 9999;
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .developer-credit strong {
        color: #00ffff;
        font-weight: bold;
      }
      .developer-credit span {
        color: #aaa;
      }
    `;
    document.head.appendChild(style);

    const footer = document.createElement('footer');
    footer.className = 'developer-credit';
    footer.innerHTML = '<span>Developed by</span><strong>Hasnain Rada</strong>';
    document.body.appendChild(footer);
});
