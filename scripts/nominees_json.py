import sys
import re
import json

def get_nominee_dict(nom_str, category):
    is_media_nomination = re.search(re.compile(r"^“(.*)” \((.*)\)$"), nom_str)
    if is_media_nomination:
        film, studio = is_media_nomination.groups()
        return {"type": "tv" if "Television" in category else "movie", "media": film, "studio": studio}

    is_person_nomination = re.search(re.compile(r"^(.*) \(“(.*)”\)$"), nom_str)
    if is_person_nomination:
        person, media = is_person_nomination.groups()
        return {"type": "person", "person": person, "media": media}

    is_song_nominaton = re.search(re.compile(r"^“(.*)” from “(.*)” \((.*)\) — (.*)$"), nom_str)
    if is_song_nominaton:
        song, media, studio, person = is_song_nominaton.groups()
        return {
            "type": "song",
            "song": song,
            "media": media,
            "studio": studio,
            "person": person,
        }

    # score must come after song, since it's a more general regex pattern
    is_writing_nomination = re.search(re.compile(r"^“(.*)” \((.*)\) — (.*)$"), nom_str)
    if is_writing_nomination:
        media, studio, person = is_writing_nomination.groups()
        return {
            "type": "crew",
            "media": media,
            "studio": studio,
            "person": person,
        }

    # should never get here
    return nom_str

def main(argv):
    if len(argv) != 3:
        print('Usage: {} <nominees txt> <award show name>'.format(argv[0]))
        sys.exit(2)

    nominees_file =  argv[1]
    show_name = argv[2]

    show_dict = {"title": show_name, "categories": {}}

    f = open(nominees_file, "r")

    current_category = None
    for line in f:
        if line.strip() == "":
            continue
        # Handle new category
        is_category_title = re.search("^Best .*$", line)
        if is_category_title:
            current_category = line.strip()
            show_dict["categories"][current_category] = []
            continue
        # Handle nominees
        nominee = get_nominee_dict(line.strip(), current_category)
        if nominee:
            show_dict["categories"][current_category].append(nominee)

    print(json.dumps(show_dict))
    f.close()


if __name__ == "__main__":
    main(sys.argv)
