filename = 'input-day2.txt'

games = []

with open(filename) as f:
    for line in f.readlines():
        games.append(line.strip().split(': ')[1].split('; '))

def part1(games):
    answer = 0
    bag = {"red": 12, "blue": 14, "green": 13}
    game_counts = []
    for index, game in enumerate(games):
        counts = {}
        for pulls in game:
            for pull in pulls.split(', '):
                count, colour = pull.split(' ')
                count = int(count)

                existing_count = counts.get(colour)
                if not existing_count or existing_count < count:
                    counts[colour] = count

        if all([bag[k] >= counts[k] for k in bag.keys()]):
            answer += index + 1

        game_counts.append(counts)
            
    return answer, game_counts 

def part2(games):
    answer = 0
    game_counts = []
    for index, game in enumerate(games):
        counts = {}
        product = 1
        for pulls in game:
            for pull in pulls.split(', '):
                count, colour = pull.split(' ')
                count = int(count)

                existing_count = counts.get(colour)
                if not existing_count or existing_count < count:
                    counts[colour] = count

        for v in counts.values():
            product *= int(v)

        answer += product
            
    return answer

part2_answer = part2(games)
print("answer is", part2_answer)
