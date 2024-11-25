export default function FormatDate(dateString: string | undefined): string {
    if(!dateString) {
        return '';
    }
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} ${formattedTime}`;
  }