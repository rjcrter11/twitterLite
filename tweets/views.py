from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse

from .models import Tweet


def home_view(request, *args, **kwargs):

    # return HttpResponse("<h1>Hello World</h1>")
    return render(request, "pages/home.html", context={}, status=200)


def tweet_detail_view(request, tweet_id, * args, **kwargs):
    '''
    Rest API view
    Consume by Javascript etc
    return json data 
    '''

    data = {
        "id": tweet_id,

        # "image_path": obj.image.url
    }
    status = 200
    try:
        obj = Tweet.objects.get(id=tweet_id)
        data['content'] = obj.content
    except:
        data['message'] = 'Not found'
        status = 404
    # json.dumps content_type "application json"
    return JsonResponse(data, status=status)
