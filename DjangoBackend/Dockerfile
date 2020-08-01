FROM python:3
LABEL maintainer="Charles Hill <chasehill70@gmail.com>"

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Install dependencies
COPY requirements.txt /
RUN pip install -r /requirements.txt

RUN mkdir /code
WORKDIR /code

# Copy project code
COPY . /code/

EXPOSE 8000

# TODO: This wasn't working earlier, but the gist was to wait until
#       postgres had spun up to then make migrations, migrate, 
#       and maybe collect static files.
# RUN apt-get update && apt-get install -y netcat
# ENTRYPOINT [ "/code/entrypoint.sh" ]
