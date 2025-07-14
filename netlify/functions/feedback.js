export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    console.log('Получены данные формы:', event.body);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Форма отправлена' }),
    };
};
