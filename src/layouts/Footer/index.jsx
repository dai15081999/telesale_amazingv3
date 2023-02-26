import './Footer.css';

export function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__addr'>
        <h2>Liên hệ:</h2>
        <address>Số nhà abc , Đường vào con tim em băng giá</address>
      </div>
      <div className='legal'>
        <p>© 2023 Amazing Tech. All Rights Reserved.</p>
        <div className='legal__links'>
          <span>
            Made by <span className='heart'>♥</span> Amazing Tech
          </span>
        </div>
      </div>
    </footer>
  );
}
