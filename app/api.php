<?php

$version = 2.55;
$pid = 2888;
$key = '8c37a45ea52';
$apiUrl = 'http://sws.api.pricegrabber.com/search_xml.php';

$q = str_replace(
    array(
        ' ',
    ),
    array(
        '%20',
    ),
    $_SERVER['QUERY_STRING']
);

$url = "{$apiUrl}?pid={$pid}&key={$key}&version={$version}&" . $q;

header('Content-Type: application/xml; charset=utf-8');
echo file_get_contents($url);
