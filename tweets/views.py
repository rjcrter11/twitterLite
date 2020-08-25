import random
from django.shortcuts import render

from django.http import HttpResponse, Http404, JsonResponse

from .forms import TweetForm
from .models import Tweet


def home_view(request, *args, **kwargs):

    # return HttpResponse("<h1>Hello World</h1>")
    return render(request, "pages/home.html", context={}, status=200)


def tweet_create_view(request, *args, **kwargs):
    form = TweetForm(request.POST or None)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.save()
        # reinitialize new blank form
        form = TweetForm()

    return render(request, 'components/form.html', context={"form": form})


def tweet_list_view(request, *args, **kwargs):
    '''
    Rest API view
    Consume by Javascript etc
    return json data 
    '''
    qs = Tweet.objects.all()
    tweets_list = [{"id": x.id, "content": x.content,
                    "likes": random.randint(0, 137)} for x in qs]
    data = {
        "isUser": False,
        "response": tweets_list
    }
    return JsonResponse(data)


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
