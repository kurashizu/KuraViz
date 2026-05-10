curl -X POST http://10.0.0.20:11400/v1/audio/voices \
  -F "name=myclone1" \
  -F "audio_sample=@voice1.wav" \
  -F "ref_text=夜晚的时候，我常常会一个人坐在窗边，Sometimes the world feels very noisy, but at night everything becomes quiet，远处还能看到城市的灯光，People are still working, studying, gaming, or talking with friends online，有时候我会想，We are all trying to figure things out step by step，也许今天有点疲惫，but tomorrow is still another chance，所以偶尔放慢一点也没关系，Little things can slowly make life feel better again"


curl -X POST http://10.0.0.20:11400/v1/audio/voices \
  -F "name=myclone" \
  -F "audio_sample=@voice.wav" \
  -F "ref_text=强化学习（Reinforcement Learning，简称 RL）是机器学习的一种重要方法，它的核心思想很像训练宠物或玩游戏升级。简单说就是：让一个智能体（agent） 在环境（environment）中不断尝试，通过奖励（reward）或惩罚来学习如何做出最好的决策。"

curl -X POST http://10.0.0.20:11400/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"input": "今天天气真不错", "voice": "default"}' \
  --output out.wav
