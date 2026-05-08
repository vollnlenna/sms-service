# sms-service
<div>
  <h2>Технические характеристики</h2>
  <p>ОС: <strong>Ubuntu Desktop 24.04</strong></p>
  <p>IDE: <strong>WebStorm</strong></p>
  <p>Язык программирования: <strong>TypeScript</strong></p>
  <p>Frontend: <strong>Vue.js</strong></p>
  <p>Backend: <strong>NestJS</strong></p>
  <p>Мобильное приложение: <strong>React Native</strong></p>
  <p>База данных: <strong>PostgreSQL</strong></p>
  <p>Контейнеризация: <strong>Docker, Docker Compose</strong></p>
</div>
<h2>Инструкция по запуску SMS Service</h2>
<h3>1. Создать файл конфигурации</h3>
<pre><code>cp .env.example .env</code></pre>
<p>* Для реального Android-устройства в файле <code>.env</code> поменять адрес API_URL</p>
<pre><code>API_URL=http://IP_КОМПЬЮТЕРА:3000</code></pre>
<hr>
<h3>2. Запустить веб-приложение</h3>
<pre><code>docker compose up</code></pre>
<p>Открыть веб-приложение в браузере:</p>
<a href="http://localhost" target="_blank">http://localhost</a><br><br>
<p><strong>Документация:</strong></p>
<a href="http://localhost:3002" target="_blank">http://localhost:3002</a>
<hr>
<h3>3. Запустить мобильное приложение</h3>
<pre><code>cd mobile/MobileApp</code></pre>
<h4>Вариант 1: Debug-запуск на реальном Android-устройстве/через Android Studio</h4>
<ol>
  <li>
    <strong>Если реальное Android-устройство: подключить телефон по USB</strong>
  </li>
  <li>
    <strong>Если через Android Studio: запустить два эмулятора</strong>
  </li>
  <li>
    <strong>Запустить Metro:</strong>
    <pre><code>npx react-native start</code></pre>
  </li>
  <li>
    <strong>Запустить приложение:</strong>
    <pre><code>npx react-native run-android</code></pre>
  </li>
</ol>
<h4>Тестовые номера для эмуляторов</h4>
<ul>
  <li>Эмулятор 1: +79999999999</li>
  <li>Эмулятор 2: +78888888888</li>
</ul>
<h4>Вариант 2: Release-сборка на реальном Android-устройстве</h4>
<ol>
  <li>
    <strong>Собрать APK:</strong>
    <pre><code>cd android 
./gradlew clean assembleRelease</code></pre>
  </li>
  <li>
    <strong>Установить APK на телефон:</strong>
    <pre><code>adb install -r app/build/outputs/apk/release/app-release.apk</code></pre>
  </li>
</ol>
<hr>