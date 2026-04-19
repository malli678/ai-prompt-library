import json
import redis

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Prompt

if getattr(settings, 'REDIS_URL', None):
    r = redis.from_url(settings.REDIS_URL, decode_responses=True)
else:
    r = redis.Redis(
        host=settings.REDIS_HOST, 
        port=settings.REDIS_PORT, 
        password=settings.REDIS_PASSWORD,
        db=0, 
        decode_responses=True
    )


def validate_prompt_data(data):
    errors = {}

    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    complexity = data.get('complexity')

    if not title:
        errors['title'] = 'Title is required.'
    elif len(title) < 3:
        errors['title'] = 'Title must be at least 3 characters.'

    if not content:
        errors['content'] = 'Content is required.'
    elif len(content) < 20:
        errors['content'] = 'Content must be at least 20 characters.'

    if complexity is None:
        errors['complexity'] = 'Complexity is required.'
    else:
        try:
            complexity = int(complexity)
            if complexity < 1 or complexity > 10:
                errors['complexity'] = 'Complexity must be between 1 and 10.'
        except (ValueError, TypeError):
            errors['complexity'] = 'Complexity must be a number between 1 and 10.'

    return errors, title, content, complexity


@csrf_exempt
@require_http_methods(["GET", "POST"])
def prompt_list(request):
    if request.method == "GET":
        prompts = list(
            Prompt.objects.all().values("id", "title", "complexity", "created_at")
        )
        for p in prompts:
            p['created_at'] = p['created_at'].isoformat()
        return JsonResponse(prompts, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, Exception):
            return JsonResponse({'error': 'Invalid JSON body.'}, status=400)

        errors, title, content, complexity = validate_prompt_data(data)
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        prompt = Prompt.objects.create(
            title=title,
            content=content,
            complexity=complexity,
        )

        return JsonResponse({
            'id': prompt.id,
            'title': prompt.title,
            'content': prompt.content,
            'complexity': prompt.complexity,
            'created_at': prompt.created_at.isoformat(),
        }, status=201)


@require_http_methods(["GET"])
def prompt_detail(request, prompt_id):
    try:
        prompt = Prompt.objects.get(id=prompt_id)
    except Prompt.DoesNotExist:
        return JsonResponse({'error': 'Prompt not found.'}, status=404)

    key = f"prompt:{prompt.id}:views"
    try:
        view_count = r.incr(key)
    except Exception as e:
        print(f"Redis error: {e}")
        view_count = 0

    return JsonResponse({
        'id': prompt.id,
        'title': prompt.title,
        'content': prompt.content,
        'complexity': prompt.complexity,
        'created_at': prompt.created_at.isoformat(),
        'view_count': view_count,
    })
