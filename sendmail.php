
<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHtml(true);

// От кого письмо
$mail->setFrom('info@magrimebel.ru', 'Шкафы купе');

$mail->addAddress('fominkk@bk.ru');

$mail->Subject = 'Поступил заказ';




// Тело письма
$body = '<h1>Письмо</h1>';

if (trim(!empty($_POST['username']))) {
	$body .= '<p><stong>Имя:</stong>' . $_POST['username'] . '</p>';
}
if (trim(!empty($_POST['userphone']))) {
	$body .= '<p><stong>Телефон:</stong>' . $_POST['userphone'] . '</p>';
}
$mail->Body = $body;

// Отправка
if (!$mail->send()) {
	$message = 'Ошибка';
} else {
	$message = 'Данные отправлены';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);

?>
