export function seo(data = {}) {
    data.title = data.title || 'Default title';
    data.metaDescription = data.metaDescription || 'Default description';
  
    document.title = data.title;
    document.querySelector('meta[name="description"]').setAttribute('content', data.metaDescription);

    let favicon = document.getElementById('favicon')
    if(data.iconColor == 'red') {
        favicon.href = './red-tick-box.png'
    } else if(data.iconColor == 'green'){
        favicon.href = './green-tick-box.png'       
    } else {
        favicon.href = './black-tick-box.png'  
    }
  }