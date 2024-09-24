<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Arr;
use MailerSend\Helpers\Builder\Personalization;
use MailerSend\Helpers\Builder\Variable;
use MailerSend\LaravelDriver\MailerSendTrait;

class Email extends Mailable
{
    use Queueable, SerializesModels, MailerSendTrait;

    protected $weatherData;

    /**
     * Create a new message instance.
     */
    public function __construct(array $weatherData)
    {
        $this->weatherData = $weatherData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Subscribe for Daily Weather Forecast',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        
        $htmlContent = $this->getHtmlContent();
        $textContent = $this->getTextContent();

        return new Content(
            // view: null,
            // html: $htmlContent,
            text: $textContent
        );
    }

    /**
     * Get HTML content for the email.
     *
     * @return string
     */
    protected function getHtmlContent(): string
    {
        $forecast = $this->weatherData['current']['condition']['text'];
        $temp = $this->weatherData['current']['temp_c'];
        return view("
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Daily Weather Forecast</title>
            </head>
            <body>
                <h1>Hello friend !</h1>
                <p>Thank you for subscribing to our daily weather forecast!</p>
                <p>Today's forecast: {$forecast} with an average temperature of {$temp}°C.</p>
                <p>Stay tuned for more updates!</p>
            </body>
            </html>
        ");
    }

    /**
     * Get plain text content for the email.
     *
     * @return string
     */
    protected function getTextContent(): string
    {
        $forecast = $this->weatherData['current']['condition']['text'];
        $temp = $this->weatherData['current']['temp_c'];

        return "Thank you for subscribing to our daily weather forecast!\n" .
               "Today's forecast: {$forecast} with an average temperature of {$temp}°C.\n\n" .
               "Stay tuned for more updates!";
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    // public function attachments(): array
    // {
    //     $icon = $this->weatherData['current']['condition']['icon'];
    //     return [
    //         Attachment::fromStorageDisk('public', $icon)
    //     ];
    // }
}