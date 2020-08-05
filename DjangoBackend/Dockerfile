FROM python:3
LABEL maintainer="Charles Hill <chasehill70@gmail.com>"

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && apt-get install -y netcat

# Install dependencies
COPY requirements.txt /
RUN pip install --upgrade pip
RUN pip install -r /requirements.txt

RUN mkdir /code
WORKDIR /code

# Copy project code
COPY . /code/

EXPOSE 8000

ENTRYPOINT [ "/code/entrypoint.sh" ]
